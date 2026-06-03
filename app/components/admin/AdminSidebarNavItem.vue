<script setup lang="ts">
defineProps<{
  to: string
  icon: string
  label: string
  active: boolean
  collapsed: boolean
  badge?: string
}>()

defineEmits<{
  navigate: []
}>()
</script>

<template>
  <li>
    <NuxtLink
      :to="to"
      class="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      :class="active
        ? 'bg-green-600 text-white shadow-sm dark:bg-green-600'
        : 'text-slate-600 hover:bg-green-50 hover:text-green-700 dark:text-slate-300 dark:hover:bg-green-950/50 dark:hover:text-green-300'"
      :aria-current="active ? 'page' : undefined"
      :aria-label="collapsed ? label : undefined"
      :title="collapsed ? label : undefined"
      @click="$emit('navigate')"
    >
      <UIcon
        :name="icon"
        class="size-4 shrink-0"
        :class="active ? 'text-white' : 'text-slate-500 group-hover:text-green-600 dark:group-hover:text-green-400'"
      />
      <span v-if="!collapsed" class="min-w-0 flex-1 truncate">
        {{ label }}
      </span>
      <span
        v-if="!collapsed && badge"
        class="rounded-full px-2 text-[10px] font-bold"
        :class="active
          ? 'bg-white/20 text-white'
          : 'bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300'"
      >
        {{ badge }}
      </span>
    </NuxtLink>
  </li>
</template>
