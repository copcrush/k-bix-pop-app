<script setup lang="ts">
import type { CatalogProduct } from '~/types/catalogProduct'
import { isProductAvailable } from '~/utils/productStatus'

import type { ArtistBrand } from '~/types/artistBrand'

const props = defineProps<{
  product: CatalogProduct
  artistBrands?: ArtistBrand[]
}>()

const { t } = useKbixLocale()
const { addProduct } = useCart()
const priceThb = computed(() => Number(props.product.price))
const { formattedPrice } = useProductPrice(priceThb)

const detailHref = computed(() => `/products/${props.product.id}`)
const canAdd = computed(() => isProductAvailable(props.product.product_status))

function onAddToCart() {
  if (!canAdd.value) return
  addProduct(props.product)
}
</script>

<template>
  <article
    class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-200/60 transition-shadow hover:shadow-md dark:border-slate-700/90 dark:bg-slate-900/80 dark:ring-slate-700/80"
  >
    <NuxtLink
      :to="detailHref"
      class="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800"
    >
      <img
        v-if="product.image_url"
        :src="product.image_url"
        :alt="product.name"
        width="600"
        height="600"
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
      >
      <div
        v-else
        class="flex size-full items-center justify-center text-sm text-slate-400"
      >
        {{ t('product.noImage') }}
      </div>
    </NuxtLink>
    <div class="flex flex-1 flex-col gap-2 p-4">
      <div>
        <KbixArtistBadge
          v-if="product.artist_name"
          :name="product.artist_name"
          :brands="artistBrands"
        />
        <NuxtLink
          :to="detailHref"
          class="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors hover:text-green-700 dark:text-slate-100 dark:hover:text-green-400"
        >
          {{ product.name }}
        </NuxtLink>
      </div>
      <div class="mt-auto flex items-center justify-between gap-2 pt-1">
        <span class="text-base font-bold tabular-nums text-slate-900 dark:text-slate-50">
          {{ formattedPrice }}
        </span>
        <UButton
          color="primary"
          variant="soft"
          size="sm"
          square
          icon="i-lucide-shopping-cart"
          :aria-label="t('home.addToCart')"
          :disabled="!canAdd"
          class="shrink-0"
          @click.prevent.stop="onAddToCart"
        />
      </div>
    </div>
  </article>
</template>
