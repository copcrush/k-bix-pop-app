<script setup lang="ts">
const props = defineProps<{
  data: number[]
  color?: string
  width?: number
  height?: number
}>()

const w = computed(() => props.width ?? 72)
const h = computed(() => props.height ?? 28)
const stroke = computed(() => props.color ?? '#1fad58')

const pathD = computed(() => {
  const pts = props.data
  if (!pts.length) return ''

  const max = Math.max(...pts)
  const min = Math.min(...pts)
  const range = max - min || 1
  const stepX = w.value / Math.max(pts.length - 1, 1)

  return pts
    .map((v, i) => {
      const x = i * stepX
      const y = h.value - ((v - min) / range) * (h.value - 4) - 2
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
})
</script>

<template>
  <svg
    :width="w"
    :height="h"
    viewBox="0 0 72 28"
    fill="none"
    aria-hidden="true"
    class="shrink-0"
  >
    <path
      :d="pathD"
      :stroke="stroke"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
