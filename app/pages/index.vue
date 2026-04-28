<script setup lang="ts">
import { HOME_POPULAR_GROUPS, HOME_PRODUCTS } from '~/data/homeLandingMocks'

const { t } = useKbixLocale()

const search = ref('')
const filterGroup = ref<string | null>(null)

const filteredProducts = computed(() => {
  const q = search.value.trim().toLowerCase()
  return HOME_PRODUCTS.filter((p) => {
    const matchesGroup = !filterGroup.value
      || (p.tags?.includes(filterGroup.value) ?? false)
    const hay = `${p.title} ${p.group}`.toLowerCase()
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

        <div
          v-if="filteredProducts.length"
          class="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
        >
          <KbixProductCard
            v-for="p in filteredProducts"
            :key="p.id"
            :product="p"
          />
        </div>
        <p
          v-else
          class="mt-10 text-center text-sm text-slate-500 dark:text-slate-400"
        >
          {{ t('home.noMatches') }}
        </p>
      </div>
    </section>
  </div>
</template>
