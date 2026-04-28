<script setup lang="ts">
import type { HomePopularGroup } from '~/data/homeLandingMocks'

defineProps<{
  groups: HomePopularGroup[]
}>()

const filterGroup = defineModel<string | null>('filterGroup', { default: null })
const search = defineModel<string>('search', { default: '' })

const { t } = useKbixLocale()
</script>

<template>
  <section
    class="border-b border-slate-200/80 bg-linear-to-b from-slate-50/90 to-white py-8 dark:border-slate-800/80 dark:from-slate-950 dark:to-slate-900"
    aria-labelledby="kbix-home-discovery-heading"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <h2
        id="kbix-home-discovery-heading"
        class="sr-only"
      >
        {{ t('home.popularGroups') }}
      </h2>

      <UInput
        v-model="search"
        size="lg"
        icon="i-lucide-search"
        :placeholder="t('home.searchPlaceholder')"
        class="w-full max-w-2xl shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-700/80"
        :aria-label="t('home.searchPlaceholder')"
      />

      <div class="mt-6">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {{ t('home.popularGroups') }}
        </p>
        <div
          class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 pt-0.5 [scrollbar-width:thin]"
          role="list"
        >
          <button
            type="button"
            role="listitem"
            class="flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors"
            :class="
              filterGroup === null
                ? 'border-green-600/50 bg-green-500/10 text-green-800 dark:border-green-400/40 dark:bg-green-500/15 dark:text-green-100'
                : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
            "
            @click="filterGroup = null"
          >
            <span class="flex size-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-600 dark:text-slate-100">
              ✦
            </span>
            {{ t('home.filterAll') }}
          </button>
          <button
            v-for="g in groups"
            :key="g.slug"
            type="button"
            role="listitem"
            class="flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors"
            :class="
              filterGroup === g.slug
                ? 'border-green-600/50 bg-green-500/10 text-green-800 dark:border-green-400/40 dark:bg-green-500/15 dark:text-green-100'
                : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
            "
            @click="filterGroup = filterGroup === g.slug ? null : g.slug"
          >
            <span
              class="flex size-8 items-center justify-center rounded-full bg-linear-to-br text-[0.65rem] font-bold text-white shadow-inner"
              :class="g.markClass"
            >
              {{ g.initials }}
            </span>
            {{ g.label }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
