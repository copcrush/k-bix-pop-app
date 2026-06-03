<script setup lang="ts">
import type { CatalogProductInsert, ProductStatus } from '~/types/catalogProduct'
import { PRODUCT_STATUS_OPTIONS } from '~/utils/productStatus'
import { uploadProductImage } from '~/utils/productStorage'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { t } = useKbixLocale()
const supabase = useSupabaseClient()
const router = useRouter()

const submitting = ref(false)
const formError = ref<string | null>(null)
const successId = ref<string | null>(null)

const name = ref('')
const description = ref('')
const price = ref<number | null>(null)
const stockQuantity = ref(100)
const productStatus = ref<ProductStatus>('pre-order')
const artistName = ref('')

const coverFile = ref<File | null>(null)
const coverPreview = ref<string | null>(null)
const detailImages = ref<string[]>([])
const galleryFieldRef = ref<{ resolveUrls: () => Promise<string[]> } | null>(null)

function onCoverChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  coverFile.value = file ?? null
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
  coverPreview.value = file ? URL.createObjectURL(file) : null
}

async function submit() {
  formError.value = null
  successId.value = null

  if (!name.value.trim()) {
    formError.value = t('admin.products.errors.nameRequired')
    return
  }
  if (price.value == null || Number.isNaN(Number(price.value)) || Number(price.value) < 0) {
    formError.value = t('admin.products.errors.priceRequired')
    return
  }
  if (!coverFile.value) {
    formError.value = t('admin.products.errors.imageRequired')
    return
  }

  submitting.value = true
  try {
    const imageUrl = await uploadProductImage(coverFile.value)
    const detailUrls = await galleryFieldRef.value?.resolveUrls() ?? []

    const row: CatalogProductInsert = {
      name: name.value.trim(),
      description: description.value.trim() || null,
      price: Number(price.value),
      stock_quantity: Math.max(0, Math.floor(stockQuantity.value)),
      product_status: productStatus.value,
      image_url: imageUrl,
      detail_images: detailUrls,
      artist_name: artistName.value.trim() || null,
    }

    const { data, error } = await supabase
      .from('products')
      .insert(row as Record<string, unknown>)
      .select('id')
      .single()

    if (error) throw error

    const id = (data as { id: string } | null)?.id
    if (!id) throw new Error('No product id returned')

    successId.value = id
    await router.push(`/products/${id}`)
  }
  catch (e) {
    formError.value = e instanceof Error ? e.message : t('common.errorGeneric')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="admin-page mx-auto max-w-4xl p-6 lg:p-8">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {{ t('admin.nav.addProduct') }}
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ t('admin.products.addHint') }}
        </p>
      </div>
      <UButton
        to="/admin/products"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        :label="t('admin.products.backToList')"
      />
    </div>

    <form
      class="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
      @submit.prevent="submit"
    >
      <UFormField
        :label="t('admin.products.fields.name')"
        required
      >
        <UInput
          v-model="name"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('admin.products.fields.artist')">
        <UInput
          v-model="artistName"
          size="lg"
          :placeholder="t('admin.products.fields.artistPlaceholder')"
          class="w-full"
        />
        <template #hint>
          {{ t('admin.products.fields.artistThemeHint') }}
          <NuxtLink
            to="/admin/artists"
            class="ms-1 font-medium text-green-700 hover:underline dark:text-green-400"
          >
            {{ t('admin.nav.artistThemes') }}
          </NuxtLink>
        </template>
      </UFormField>

      <UFormField :label="t('admin.products.fields.description')">
        <UTextarea
          v-model="description"
          :rows="4"
          class="w-full"
        />
      </UFormField>

      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField
          :label="t('admin.products.fields.price')"
          required
        >
          <UInput
            v-model.number="price"
            type="number"
            min="0"
            step="1"
            size="lg"
            class="w-full"
          />
          <template #hint>
            {{ t('admin.products.fields.priceHint') }}
          </template>
        </UFormField>

        <UFormField :label="t('admin.products.fields.stock')">
          <UInput
            v-model.number="stockQuantity"
            type="number"
            min="0"
            size="lg"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField :label="t('admin.products.fields.status')">
        <USelect
          v-model="productStatus"
          :items="PRODUCT_STATUS_OPTIONS.map(o => ({ label: o.label, value: o.value }))"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="t('admin.products.fields.cover')"
        required
      >
        <input
          type="file"
          accept="image/*"
          class="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-800 dark:text-slate-300 dark:file:bg-green-950/50 dark:file:text-green-200"
          @change="onCoverChange"
        >
        <img
          v-if="coverPreview"
          :src="coverPreview"
          alt=""
          class="mt-3 max-h-48 rounded-xl border border-slate-200 object-contain dark:border-slate-700"
        >
      </UFormField>

      <AdminProductGalleryField
        ref="galleryFieldRef"
        v-model="detailImages"
      />

      <p
        v-if="formError"
        class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
      >
        {{ formError }}
      </p>

      <div class="flex flex-wrap gap-3 pt-2">
        <UButton
          type="submit"
          color="primary"
          size="lg"
          :loading="submitting"
          :label="t('admin.products.submit')"
        />
        <UButton
          to="/"
          color="neutral"
          variant="outline"
          size="lg"
          :label="t('admin.products.viewShop')"
        />
      </div>
    </form>
  </div>
</template>
