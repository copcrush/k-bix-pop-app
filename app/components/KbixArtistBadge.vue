<script setup lang="ts">
import type { ArtistBrand } from '~/types/artistBrand'
import { artistBadgeStyle, findArtistBrand } from '~/utils/artistBrand'

const props = withDefaults(
  defineProps<{
    name: string
    brands?: ArtistBrand[]
    size?: 'sm' | 'md'
  }>(),
  { size: 'sm' },
)

const sizeClass = computed(() =>
  props.size === 'md'
    ? 'px-2.5 py-1 text-sm'
    : 'px-2 py-0.5 text-[0.65rem]',
)

const theme = computed(() =>
  props.brands
    ? findArtistBrand(props.name, props.brands)
    : null,
)

const badgeStyle = computed(() =>
  theme.value ? artistBadgeStyle(theme.value) : undefined,
)

const badgeClass = computed(() => [
  sizeClass.value,
  theme.value ? '' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
])
</script>

<template>
  <span
    v-if="name"
    class="inline-block max-w-full truncate rounded-md font-semibold leading-tight tracking-wide"
    :class="badgeClass"
    :style="badgeStyle"
  >
    {{ name }}
  </span>
</template>
