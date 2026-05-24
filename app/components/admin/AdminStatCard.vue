<script setup lang="ts">
import type { AdminOrderStat } from '~/data/adminOrdersMocks'

defineProps<{
  stat: AdminOrderStat
}>()
</script>

<template>
  <article
    class="admin-stat-card rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-slate-500">
          {{ stat.label }}
        </p>
        <p class="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {{ stat.value.toLocaleString() }}
        </p>
        <p
          class="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
          :class="stat.change >= 0
            ? 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'"
        >
          <UIcon
            :name="stat.change >= 0 ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'"
            class="size-3"
          />
          {{ Math.abs(stat.change) }}% vs last month
        </p>
      </div>
      <AdminSparkline :data="stat.sparkline" :color="stat.color" />
    </div>
  </article>
</template>
