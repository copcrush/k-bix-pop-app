<script setup lang="ts">
import type { CatalogProduct } from '~/types/catalogProduct'
import { getProductStatusBadge } from '~/utils/productStatus'

const props = defineProps<{
  product: CatalogProduct
}>()

const badge = computed(() => getProductStatusBadge(props.product.product_status))

const formattedPrice = computed(() => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(props.product.price))
  }
  catch {
    return `$${props.product.price}`
  }
})
</script>

<template>
  <article
    class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-slate-200/50 transition-shadow duration-300 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900/70 dark:ring-slate-700/60"
  >
    <div class="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
      <img
        v-if="product.image_url"
        :src="product.image_url"
        :alt="product.name"
        width="700"
        height="700"
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
      >
      <div
        v-else
        class="flex size-full items-center justify-center text-sm text-slate-400"
      >
        No image
      </div>
      <span
        class="absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider ring-1 ring-inset backdrop-blur-sm"
        :class="[badge.bg, badge.text, badge.ring]"
      >
        {{ badge.label }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-5 sm:p-6">
      <div class="space-y-2">
        <h3 class="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-50">
          {{ product.name }}
        </h3>
        <p
          v-if="product.description"
          class="line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
        >
          {{ product.description }}
        </p>
      </div>

      <div class="mt-auto flex items-end justify-between gap-4 pt-2">
        <span class="text-xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">
          {{ formattedPrice }}
        </span>
        <span class="text-xs text-slate-400 dark:text-slate-500">
          {{ product.stock_quantity }} left
        </span>
      </div>
    </div>
  </article>
</template>
