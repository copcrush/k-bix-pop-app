<script setup lang="ts">
import type { AdminNavSection } from '~/composables/useAdminNav'

defineProps<{
  section: AdminNavSection
  collapsed: boolean
  expanded: boolean
}>()

defineEmits<{
  toggle: []
  navigate: []
}>()

const { isActive, labelFor } = useAdminNav()
</script>

<template>
  <div class="mb-1">
    <button
      v-if="!collapsed"
      type="button"
      class="mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase transition hover:text-green-700 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:outline-none dark:hover:text-green-400"
      :aria-expanded="expanded"
      @click="$emit('toggle')"
    >
      <UIcon :name="section.icon" class="size-3.5 shrink-0" />
      <span class="min-w-0 flex-1 truncate text-start">{{ labelFor(section.titleKey) }}</span>
      <UIcon
        name="i-lucide-chevron-down"
        class="size-3.5 shrink-0 transition-transform duration-200"
        :class="expanded ? '' : '-rotate-90'"
      />
    </button>

    <div
      class="overflow-hidden transition-[max-height] duration-200 ease-in-out"
      :style="{ maxHeight: collapsed || expanded ? '2000px' : '0' }"
    >
      <ul class="space-y-0.5 pb-2">
        <AdminSidebarNavItem
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :label="labelFor(item.labelKey)"
          :active="isActive(item.to)"
          :collapsed="collapsed"
          :badge="item.badge"
          @navigate="$emit('navigate')"
        />
      </ul>
    </div>
  </div>
</template>
