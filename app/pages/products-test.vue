<script setup lang="ts">
import type { CatalogProduct } from '~/types/catalogProduct'
import {
  PRODUCT_STATUS_FILTERS,
  type ProductStatusFilter,
} from '~/utils/productStatus'

definePageMeta({
  layout: 'default',
})

const supabase = useSupabaseClient()
const statusFilter = ref<ProductStatusFilter>('all')

const { data: products, error, pending, refresh } = await useAsyncData(
  'catalog-products',
  async () => {
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('id, name, description, price, stock_quantity, product_status, image_url, detail_images, artist_name')
      .order('name', { ascending: true })

    if (fetchError) {
      throw fetchError
    }

    return (data ?? []) as CatalogProduct[]
  },
)

const filteredProducts = computed(() => {
  const list = products.value ?? []
  if (statusFilter.value === 'all') {
    return list
  }
  return list.filter(
    p => p.product_status?.toLowerCase() === statusFilter.value,
  )
})
</script>

<template>
  <div class="bg-default">
    <section class="border-b border-slate-200/70 bg-white/60 py-12 dark:border-slate-800/80 dark:bg-slate-900/40 sm:py-16">
      <div class="mx-auto max-w-7xl px-5 sm:px-8">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Supabase catalog test
        </p>
        <h1 class="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
          Product grid
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          Live data from the <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">products</code> table.
          Use the filters below to simulate status-based browsing.
        </p>

        <div
          class="mt-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by product status"
        >
          <button
            v-for="option in PRODUCT_STATUS_FILTERS"
            :key="option.value"
            type="button"
            class="rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200"
            :class="statusFilter === option.value
              ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'"
            @click="statusFilter = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16">
      <div class="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          v-if="pending"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div
            v-for="n in 4"
            :key="n"
            class="aspect-[3/4] animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/80"
          />
        </div>

        <div
          v-else-if="error"
          class="rounded-2xl border border-red-200/80 bg-red-50/80 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/30"
        >
          <p class="text-sm font-medium text-red-800 dark:text-red-300">
            Could not load products
          </p>
          <p class="mt-2 text-sm text-red-600/90 dark:text-red-400/90">
            {{ error.message }}
          </p>
          <UButton
            class="mt-6"
            variant="soft"
            color="neutral"
            label="Retry"
            @click="refresh()"
          />
        </div>

        <div
          v-else-if="filteredProducts.length"
          class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <KbixCatalogProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <p
          v-else
          class="py-16 text-center text-sm text-slate-500 dark:text-slate-400"
        >
          No products match this filter. Run the SQL seed or switch to “All”.
        </p>
      </div>
    </section>
  </div>
</template>
