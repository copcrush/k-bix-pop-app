<script setup lang="ts">
import { artistBadgeStyle, normalizeArtistHex } from '~/utils/artistBrand'

const { t } = useKbixLocale()

const props = defineProps<{
  name: string
  colorStart: string
  colorEnd: string | null
  useGradient: boolean
  gradientAngle: number
}>()

const previewStyle = computed(() =>
  artistBadgeStyle({
    id: 'preview',
    slug: 'preview',
    name: props.name || 'Artist',
    color_start: normalizeArtistHex(props.colorStart),
    color_end: props.useGradient && props.colorEnd
      ? normalizeArtistHex(props.colorEnd)
      : null,
    gradient_angle: props.gradientAngle,
  }),
)
</script>

<template>
  <div class="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
    <p class="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
      {{ t('admin.artists.preview') }}
    </p>
    <span
      class="inline-block rounded-md px-3 py-1 text-sm font-semibold"
      :style="previewStyle"
    >
      {{ name || 'Artist name' }}
    </span>
  </div>
</template>
