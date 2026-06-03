<script setup lang="ts">
import type { CatalogProduct } from '~/types/catalogProduct'
import { getProductStatusBadge, isProductAvailable } from '~/utils/productStatus'

const route = useRoute()
const { t } = useKbixLocale()
const { fetchById } = useCatalogProducts()
const { fetchAll: fetchArtistBrands } = useArtistBrands()
const { addProduct } = useCart()

const productId = computed(() => String(route.params.id ?? ''))

const { data: product, error, pending } = await useAsyncData(
  () => `product-${productId.value}`,
  () => fetchById(productId.value),
  { watch: [productId] },
)

const { data: artistBrands } = await useAsyncData(
  'artist-brands',
  () => fetchArtistBrands(),
)

const badge = computed(() =>
  product.value
    ? getProductStatusBadge(product.value.product_status)
    : null,
)

const priceThb = computed(() => Number(product.value?.price ?? 0))
const { formattedPrice } = useProductPrice(priceThb)

const gallery = computed(() => {
  const p = product.value
  if (!p) return [] as string[]
  const extras = (p.detail_images ?? []).filter(Boolean)
  const main = p.image_url ? [p.image_url] : []
  const merged = [...main, ...extras]
  return [...new Set(merged)]
})

const activeImage = ref<string | null>(null)

watch(
  gallery,
  (urls) => {
    activeImage.value = urls[0] ?? null
  },
  { immediate: true },
)

const quantity = ref(1)
const addedFlash = ref(false)

const canAdd = computed(() =>
  product.value ? isProductAvailable(product.value.product_status) : false,
)

function onAddToCart() {
  if (!product.value || !canAdd.value) return
  addProduct(product.value, quantity.value)
  addedFlash.value = true
  setTimeout(() => {
    addedFlash.value = false
  }, 2200)
}

useHead({
  title: computed(() => product.value?.name ?? t('product.detailTitle')),
})
</script>

<template>
  <div class="bg-default">
    <UContainer class="py-8 sm:py-12">
      <div
        v-if="pending"
        class="grid gap-10 lg:grid-cols-2"
      >
        <div class="aspect-square animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div class="space-y-4">
          <div class="h-8 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div class="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <div
        v-else-if="error || !product"
        class="rounded-2xl border border-red-200/80 bg-red-50/80 px-6 py-10 text-center dark:border-red-900/50 dark:bg-red-950/30"
      >
        <p class="font-medium text-red-800 dark:text-red-300">
          {{ t('product.notFound') }}
        </p>
        <p
          v-if="error"
          class="mt-2 text-sm text-red-600/90 dark:text-red-400/90"
        >
          {{ error.message }}
        </p>
        <UButton
          to="/"
          class="mt-6"
          color="primary"
          :label="t('product.backToShop')"
        />
      </div>

      <div
        v-else
        class="grid gap-10 lg:grid-cols-2 lg:gap-14"
      >
        <div class="space-y-4">
          <div class="relative aspect-square overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
            <img
              v-if="activeImage"
              :src="activeImage"
              :alt="product.name"
              width="800"
              height="800"
              class="size-full object-cover"
            >
            <div
              v-else
              class="flex size-full items-center justify-center text-slate-400"
            >
              {{ t('product.noImage') }}
            </div>
            <span
              v-if="badge"
              class="absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider ring-1 ring-inset backdrop-blur-sm"
              :class="[badge.bg, badge.text, badge.ring]"
            >
              {{ badge.label }}
            </span>
          </div>
          <div
            v-if="gallery.length > 1"
            class="flex gap-2 overflow-x-auto pb-1"
          >
            <button
              v-for="(url, idx) in gallery"
              :key="`${url}-${idx}`"
              type="button"
              class="size-16 shrink-0 overflow-hidden rounded-lg border-2 transition"
              :class="activeImage === url
                ? 'border-green-500'
                : 'border-transparent opacity-80 hover:opacity-100'"
              @click="activeImage = url"
            >
              <img
                :src="url"
                :alt="`${product.name} ${idx + 1}`"
                width="64"
                height="64"
                class="size-full object-cover"
              >
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div>
            <KbixArtistBadge
              v-if="product.artist_name"
              :name="product.artist_name"
              :brands="artistBrands ?? []"
              size="md"
            />
            <h1 class="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              {{ product.name }}
            </h1>
            <p class="mt-4 text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
              {{ formattedPrice }}
            </p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {{ t('product.stockLeft').replace('{count}', String(product.stock_quantity)) }}
            </p>
          </div>

          <p
            v-if="product.description"
            class="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
          >
            {{ product.description }}
          </p>

          <div class="flex flex-wrap items-center gap-4 border-t border-slate-200/80 pt-6 dark:border-slate-700">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                {{ t('product.quantity') }}
              </span>
              <UInput
                v-model.number="quantity"
                type="number"
                min="1"
                :max="Math.max(1, product.stock_quantity)"
                class="w-20"
              />
            </div>
            <UButton
              color="primary"
              size="lg"
              icon="i-lucide-shopping-cart"
              :label="t('home.addToCart')"
              :disabled="!canAdd"
              @click="onAddToCart"
            />
            <UButton
              to="/cart"
              color="neutral"
              variant="outline"
              size="lg"
              :label="t('nav.cart')"
            />
          </div>

          <p
            v-if="addedFlash"
            class="text-sm font-medium text-green-700 dark:text-green-400"
            role="status"
          >
            {{ t('product.addedToCart') }}
          </p>
          <p
            v-if="!canAdd"
            class="text-sm text-slate-500 dark:text-slate-400"
          >
            {{ t('product.unavailable') }}
          </p>
        </div>
      </div>
    </UContainer>
  </div>
</template>
