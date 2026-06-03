<script setup lang="ts">
import type { CatalogProduct, ProductStatus } from '~/types/catalogProduct'
import { PRODUCT_STATUS_OPTIONS } from '~/utils/productStatus'
import { uploadProductImage } from '~/utils/productStorage'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const router = useRouter()
const { t } = useKbixLocale()
const supabase = useSupabaseClient()
const { fetchById } = useCatalogProducts()

const productId = computed(() => String(route.params.id ?? ''))

const { data: product, error: loadError, pending } = await useAsyncData(
  () => `admin-edit-product-${productId.value}`,
  () => fetchById(productId.value),
  { watch: [productId] },
)

const submitting = ref(false)
const formError = ref<string | null>(null)

const name = ref('')
const description = ref('')
const price = ref<number | null>(null)
const stockQuantity = ref(0)
const productStatus = ref<ProductStatus>('pre-order')
const artistName = ref('')

const coverFile = ref<File | null>(null)
const coverPreview = ref<string | null>(null)
const detailImages = ref<string[]>([])
const galleryFieldRef = ref<{ resolveUrls: () => Promise<string[]> } | null>(null)

const loaded = ref(false)

watch(
  product,
  (p) => {
    if (!p || loaded.value) return
    name.value = p.name
    description.value = p.description ?? ''
    price.value = Number(p.price)
    stockQuantity.value = p.stock_quantity
    productStatus.value = p.product_status
    artistName.value = p.artist_name ?? ''
    coverPreview.value = p.image_url
    detailImages.value = [...(p.detail_images ?? [])]
    loaded.value = true
  },
  { immediate: true },
)

function onCoverChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  coverFile.value = file ?? null
  if (coverPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(coverPreview.value)
  }
  coverPreview.value = file
    ? URL.createObjectURL(file)
    : product.value?.image_url ?? null
}

async function submit() {
  if (!product.value) return
  formError.value = null

  if (!name.value.trim()) {
    formError.value = t('admin.products.errors.nameRequired')
    return
  }
  if (price.value == null || Number.isNaN(Number(price.value)) || Number(price.value) < 0) {
    formError.value = t('admin.products.errors.priceRequired')
    return
  }

  submitting.value = true
  try {
    let imageUrl = product.value.image_url
    if (coverFile.value) {
      imageUrl = await uploadProductImage(coverFile.value)
    }

    const mergedDetails = await galleryFieldRef.value?.resolveUrls() ?? [...detailImages.value]

    const row = {
      name: name.value.trim(),
      description: description.value.trim() || null,
      price: Number(price.value),
      stock_quantity: Math.max(0, Math.floor(stockQuantity.value)),
      product_status: productStatus.value,
      image_url: imageUrl,
      detail_images: mergedDetails,
      artist_name: artistName.value.trim() || null,
    }

    const { error } = await supabase
      .from('products')
      .update(row as Record<string, unknown>)
      .eq('id', productId.value)

    if (error) throw error

    await clearNuxtData(['home-products', 'admin-product-list', `product-${productId.value}`, `admin-edit-product-${productId.value}`])
    await router.push(`/products/${productId.value}`)
  }
  catch (e) {
    formError.value = e instanceof Error ? e.message : t('common.errorGeneric')
  }
  finally {
    submitting.value = false
  }
}

onUnmounted(() => {
  if (coverPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(coverPreview.value)
  }
})
</script>

<template>
  <div class="admin-page mx-auto max-w-4xl p-6 lg:p-8">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {{ t('admin.products.editTitle') }}
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ t('admin.products.editHint') }}
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

    <div
      v-if="pending"
      class="space-y-4"
    >
      <div class="h-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div class="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
    </div>

    <div
      v-else-if="loadError || !product"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
    >
      {{ loadError?.message ?? t('product.notFound') }}
      <UButton
        to="/admin/products"
        class="mt-4"
        variant="soft"
        :label="t('admin.products.backToList')"
      />
    </div>

    <form
      v-else
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

      <UFormField :label="t('admin.products.fields.cover')">
        <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">
          {{ t('admin.products.fields.coverReplaceHint') }}
        </p>
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
          :label="t('admin.products.saveChanges')"
        />
        <UButton
          :to="`/products/${productId}`"
          color="neutral"
          variant="outline"
          size="lg"
          :label="t('admin.products.viewOnShop')"
        />
      </div>
    </form>
  </div>
</template>
