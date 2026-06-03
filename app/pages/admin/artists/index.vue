<script setup lang="ts">
import type { ArtistBrand } from '~/types/artistBrand'
import { artistBadgeStyle } from '~/utils/artistBrand'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { t } = useKbixLocale()
const { fetchAll } = useArtistBrands()

const { data: artists, error, pending, refresh } = await useAsyncData(
  'admin-artist-list',
  () => fetchAll(),
)
</script>

<template>
  <div class="admin-page p-6 lg:p-8">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {{ t('admin.nav.artistThemes') }}
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ t('admin.artists.listHint') }}
        </p>
      </div>
      <UButton
        to="/admin/artists/new"
        color="primary"
        icon="i-lucide-plus"
        :label="t('admin.artists.add')"
      />
    </div>

    <div
      v-if="pending"
      class="space-y-3"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="h-14 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"
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
      v-else-if="!(artists as ArtistBrand[])?.length"
      class="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400"
    >
      {{ t('admin.artists.empty') }}
      <UButton
        to="/admin/artists/new"
        class="mt-4"
        color="primary"
        :label="t('admin.artists.add')"
      />
    </div>

    <ul
      v-else
      class="divide-y divide-slate-200 rounded-xl border border-slate-200/90 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900/80"
    >
      <li
        v-for="a in (artists as ArtistBrand[])"
        :key="a.id"
        class="flex items-center gap-4 p-4"
      >
        <span
          class="inline-block min-w-[5rem] rounded-md px-2.5 py-1 text-center text-xs font-semibold"
          :style="artistBadgeStyle(a)"
        >
          {{ a.name }}
        </span>
        <div class="min-w-0 flex-1 text-xs text-slate-500 dark:text-slate-400">
          <span class="font-mono">{{ a.slug }}</span>
          <span class="mx-2">·</span>
          <span>{{ a.color_start }}</span>
          <template v-if="a.color_end">
            <span> → {{ a.color_end }}</span>
          </template>
        </div>
        <UButton
          :to="`/admin/artists/${a.id}/edit`"
          color="primary"
          variant="soft"
          size="sm"
          icon="i-lucide-pencil"
          :aria-label="t('admin.artists.edit')"
        />
      </li>
    </ul>
  </div>
</template>
