<script setup lang="ts">
import type { CatalogProduct } from '~/types/catalogProduct'
import { getProductStatusBadge } from '~/utils/productStatus'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { t } = useKbixLocale()
const { fetchAll } = useCatalogProducts()

const { data: products, error, pending, refresh } = await useAsyncData(
  'admin-product-list',
  () => fetchAll(),
)
</script>

<template>
  <div class="admin-page p-6 lg:p-8">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {{ t('admin.nav.productList') }}
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ t('admin.products.listHint') }}
        </p>
      </div>
      <UButton
        to="/admin/products/new"
        color="primary"
        icon="i-lucide-plus"
        :label="t('admin.nav.addProduct')"
      />
    </div>

    <div
      v-if="pending"
      class="space-y-3"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"
      />
    </div>

    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
    >
      {{ error.message }}
      <UButton
        class="mt-4"
        variant="soft"
        :label="t('product.retry')"
        @click="refresh()"
      />
    </div>

    <div
      v-else-if="!(products as CatalogProduct[])?.length"
      class="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400"
    >
      {{ t('admin.products.empty') }}
      <UButton
        to="/admin/products/new"
        class="mt-4"
        color="primary"
        :label="t('admin.nav.addProduct')"
      />
    </div>

    <ul
      v-else
      class="divide-y divide-slate-200 rounded-xl border border-slate-200/90 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900/80"
    >
      <li
        v-for="p in (products as CatalogProduct[])"
        :key="p.id"
        class="flex items-center gap-4 p-4"
      >
        <img
          v-if="p.image_url"
          :src="p.image_url"
          :alt="p.name"
          width="56"
          height="56"
          class="size-14 shrink-0 rounded-lg object-cover"
        >
        <div
          v-else
          class="flex size-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 dark:bg-slate-800"
        >
          —
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate font-semibold text-slate-900 dark:text-slate-100">
            {{ p.name }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ p.artist_name || '—' }} · ฿{{ p.price }}
          </p>
        </div>
        <span
          class="hidden shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase sm:inline-flex"
          :class="[getProductStatusBadge(p.product_status).bg, getProductStatusBadge(p.product_status).text]"
        >
          {{ getProductStatusBadge(p.product_status).label }}
        </span>
        <UButton
          :to="`/admin/products/${p.id}/edit`"
          color="primary"
          variant="soft"
          size="sm"
          icon="i-lucide-pencil"
          :aria-label="t('admin.products.editProduct')"
        />
        <UButton
          :to="`/products/${p.id}`"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-external-link"
          :aria-label="t('admin.products.viewOnShop')"
        />
      </li>
    </ul>
  </div>
</template>
