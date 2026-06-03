<script setup lang="ts">
import { HOME_POPULAR_GROUPS } from '~/data/homeLandingMocks'
import type { CatalogProduct } from '~/types/catalogProduct'

const { t } = useKbixLocale()
const { fetchAll } = useCatalogProducts()
const { fetchAll: fetchArtistBrands } = useArtistBrands()

const search = ref('')
const filterGroup = ref<string | null>(null)

const { data: products, error, pending, refresh } = await useAsyncData(
  'home-products',
  () => fetchAll(),
)

const { data: artistBrands } = await useAsyncData(
  'artist-brands',
  () => fetchArtistBrands(),
)

const filteredProducts = computed(() => {
  const list = (products.value ?? []) as CatalogProduct[]
  const q = search.value.trim().toLowerCase()
  return list.filter((p) => {
    const artist = p.artist_name?.toLowerCase() ?? ''
    const matchesGroup = !filterGroup.value
      || artist.includes(filterGroup.value)
      || artist === filterGroup.value
    const hay = `${p.name} ${p.description ?? ''} ${artist}`.toLowerCase()
    const matchesSearch = !q || hay.includes(q)
    return matchesGroup && matchesSearch
  })
})
</script>

<template>
  <div class="bg-default">
    <AppHomeDiscoverySection
      v-model:search="search"
      v-model:filter-group="filterGroup"
      :groups="HOME_POPULAR_GROUPS"
      :artist-brands="artistBrands ?? []"
    />

    <section
      class="py-10 sm:py-12"
      aria-labelledby="kbix-home-products-heading"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <h2
          id="kbix-home-products-heading"
          class="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl"
        >
          {{ t('home.newArrivals') }}
        </h2>
        <p class="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          {{ t('home.newArrivalsHint') }}
        </p>
        <details
          class="kbix-legal-notice group mt-2 max-w-3xl rounded-lg border border-slate-200/90 bg-slate-50/90 dark:border-slate-700/90 dark:bg-slate-900/50"
        >
          <summary
            class="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-semibold tracking-wide text-slate-700 outline-none hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-green-400/60 dark:text-slate-300 dark:hover:text-slate-100"
          >
            <UIcon
              name="i-lucide-chevron-right"
              class="size-3.5 shrink-0 transition-transform duration-200 group-open:rotate-90"
              aria-hidden="true"
            />
            {{ t('home.disclaimerToggle') }}
          </summary>
          <p class="border-t border-slate-200/80 px-3 py-2.5 text-xs leading-relaxed text-slate-600 dark:border-slate-700/80 dark:text-slate-400">
            {{ t('home.disclaimerNotice') }}
          </p>
        </details>

        <div
          v-if="pending"
          class="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
        >
          <div
            v-for="n in 8"
            :key="n"
            class="aspect-[3/4] animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/80"
          />
        </div>

        <div
          v-else-if="error"
          class="mt-8 rounded-2xl border border-red-200/80 bg-red-50/80 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/30"
        >
          <p class="text-sm font-medium text-red-800 dark:text-red-300">
            {{ t('product.loadError') }}
          </p>
          <p class="mt-2 text-sm text-red-600/90 dark:text-red-400/90">
            {{ error.message }}
          </p>
          <UButton
            class="mt-4"
            variant="soft"
            color="neutral"
            :label="t('product.retry')"
            @click="refresh()"
          />
        </div>

        <div
          v-else-if="filteredProducts.length"
          class="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
        >
          <KbixProductCard
            v-for="p in filteredProducts"
            :key="p.id"
            :product="p"
            :artist-brands="artistBrands ?? []"
          />
        </div>
        <p
          v-else
          class="mt-10 text-center text-sm text-slate-500 dark:text-slate-400"
        >
          {{ products?.length ? t('home.noMatches') : t('home.emptyCatalog') }}
        </p>
      </div>
    </section>
  </div>
</template>
