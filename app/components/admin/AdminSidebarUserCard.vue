<script setup lang="ts">
defineProps<{
  collapsed: boolean
}>()

const { t } = useKbixLocale()
const { user, displayName, initials } = useAuth()
const { adminRole } = useAdminNav()

const profileName = computed(() => displayName(user.value) || '—')

const roleLabelKey = computed(() => {
  const map = {
    owner: 'admin.roles.owner',
    staff: 'admin.roles.staff',
    viewer: 'admin.roles.viewer',
  } as const
  return map[adminRole.value]
})

const roleDotClass = computed(() => {
  const map = {
    owner: 'bg-green-500',
    staff: 'bg-blue-400',
    viewer: 'bg-slate-400',
  } as const
  return map[adminRole.value]
})
</script>

<template>
  <div
    class="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 px-2.5 py-2 dark:border-slate-700 dark:bg-slate-900/50"
    :class="collapsed ? 'justify-center px-2' : ''"
  >
    <UAvatar
      :alt="profileName"
      :text="initials(user)"
      size="sm"
      class="size-8 shrink-0 bg-green-500/20 text-sm font-semibold text-green-800 dark:bg-green-500/30 dark:text-green-50"
    />
    <div v-if="!collapsed" class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
        {{ profileName }}
      </p>
      <p class="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400">
        <span class="size-1.5 shrink-0 rounded-full" :class="roleDotClass" aria-hidden="true" />
        {{ t(roleLabelKey) }}
      </p>
    </div>
  </div>
</template>
