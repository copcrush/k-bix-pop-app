<script setup lang="ts">
const { t } = useKbixLocale()
const { menuGroups, isActive, labelFor } = useAdminNav()
const { user, displayName, initials, logout } = useAuth()

const searchQuery = ref('')
const collapsed = ref(false)

const profileEmail = computed(() => user.value?.email ?? 'esther@gmail.com')
const profileName = computed(() => displayName(user.value) || 'Esther Howard')

async function onLogout() {
  await logout()
  await navigateTo('/login')
}

function focusAdminSearch(e: KeyboardEvent) {
  if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
    e.preventDefault()
    document.getElementById('admin-sidebar-search')?.focus()
  }
}

onMounted(() => window.addEventListener('keydown', focusAdminSearch))
onUnmounted(() => window.removeEventListener('keydown', focusAdminSearch))
</script>

<template>
  <aside
    class="admin-sidebar flex h-dvh w-[220px] shrink-0 flex-col border-r border-slate-200/90 bg-white/95 backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-950/95"
    :class="{ 'w-[68px]': collapsed }"
  >
    <!-- Top: brand + workspace + search -->
    <div class="shrink-0 space-y-3 border-b border-slate-100 p-3 dark:border-slate-800">
      <div class="flex items-center gap-2 px-1">
        <div
          class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-green-400 via-green-500 to-fuchsia-500 text-white shadow-md ring-2 ring-white/80 dark:ring-slate-900/80"
        >
          <UIcon name="i-lucide-sparkles" class="size-4" />
        </div>
        <template v-if="!collapsed">
          <span class="min-w-0 flex-1 truncate text-sm font-bold tracking-tight text-green-700 dark:text-green-400">
            {{ t('admin.brand') }}
          </span>
          <button
            type="button"
            class="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            :aria-label="t('admin.collapseSidebar')"
            @click="collapsed = !collapsed"
          >
            <UIcon name="i-lucide-chevrons-left" class="size-4" />
          </button>
        </template>
      </div>

      <template v-if="!collapsed">
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-green-300 hover:bg-green-50/50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-green-700/50 dark:hover:bg-green-950/40"
        >
          <UIcon name="i-lucide-shopping-bag" class="size-4 shrink-0 text-green-600 dark:text-green-400" />
          <span class="min-w-0 flex-1 truncate font-medium">{{ t('common.brand') }}</span>
          <UIcon name="i-lucide-chevrons-up-down" class="size-3.5 shrink-0 text-slate-400" />
        </button>

        <div class="relative">
          <UIcon
            name="i-lucide-search"
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            id="admin-sidebar-search"
            v-model="searchQuery"
            type="search"
            :placeholder="t('admin.searchPlaceholder')"
            class="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-green-600 dark:focus:ring-green-900/50"
          >
          <kbd
            class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-600 dark:bg-slate-800"
          >
            /
          </kbd>
        </div>
      </template>
    </div>

    <!-- Scrollable nav -->
    <nav class="min-h-0 flex-1 overflow-y-auto px-2 py-3">
      <div
        v-for="group in menuGroups"
        :key="group.labelKey"
        class="mb-4"
      >
        <p
          v-if="!collapsed"
          class="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400"
        >
          {{ labelFor(group.labelKey) }}
        </p>
        <ul class="space-y-0.5">
          <li
            v-for="item in group.items"
            :key="item.to"
          >
            <NuxtLink
              :to="item.to"
              class="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition"
              :class="isActive(item.to)
                ? 'bg-green-600 text-white shadow-sm dark:bg-green-600'
                : 'text-slate-600 hover:bg-green-50 hover:text-green-700 dark:text-slate-300 dark:hover:bg-green-950/50 dark:hover:text-green-300'"
              :title="collapsed ? labelFor(item.labelKey) : undefined"
            >
              <UIcon
                :name="item.icon"
                class="size-4 shrink-0"
                :class="isActive(item.to) ? 'text-white' : 'text-slate-500 group-hover:text-green-600 dark:group-hover:text-green-400'"
              />
              <span v-if="!collapsed" class="min-w-0 flex-1 truncate">
                {{ labelFor(item.labelKey) }}
              </span>
              <span
                v-if="!collapsed && item.badge"
                class="flex size-5 items-center justify-center rounded-full text-[10px] font-bold"
                :class="isActive(item.to)
                  ? 'bg-white/20 text-white'
                  : 'bg-fuchsia-500 text-white'"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Bottom: profile + actions -->
    <div class="shrink-0 space-y-2 border-t border-slate-100 p-3 dark:border-slate-800">
      <button
        v-if="!collapsed"
        type="button"
        class="flex w-full items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 px-2.5 py-2 text-left transition hover:border-green-300 hover:bg-green-50/40 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-green-700/50 dark:hover:bg-green-950/40"
      >
        <UAvatar
          :alt="profileName"
          :text="initials(user)"
          size="sm"
          class="shrink-0 bg-green-500/20 text-green-800 dark:bg-green-500/30 dark:text-green-50"
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {{ profileName }}
          </p>
          <p class="truncate text-xs text-slate-500 dark:text-slate-400">
            {{ profileEmail }}
          </p>
        </div>
        <UIcon name="i-lucide-chevrons-up-down" class="size-3.5 shrink-0 text-slate-400" />
      </button>

      <NuxtLink
        to="/"
        class="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/70"
        :class="collapsed ? 'px-2' : ''"
        :title="collapsed ? t('admin.goToShop') : undefined"
      >
        <UIcon name="i-lucide-external-link" class="size-4 shrink-0" />
        <span v-if="!collapsed">{{ t('admin.goToShop') }}</span>
      </NuxtLink>

      <button
        type="button"
        class="w-full text-center text-xs font-medium text-slate-500 transition hover:text-green-600 dark:hover:text-green-400"
        @click="onLogout"
      >
        {{ t('nav.logout') }}
      </button>
    </div>
  </aside>
</template>
