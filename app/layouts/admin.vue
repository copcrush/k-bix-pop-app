<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const nav = shallowRef<NavigationMenuItem[]>([
  { label: 'Dashboard', to: '/admin', icon: 'i-lucide-layout-dashboard' }
])
</script>

<template>
  <UDashboardGroup storage-key="k-bix-admin" class="min-h-dvh bg-default">
    <UDashboardSidebar collapsible>
      <template #header>
        <span class="px-2 text-sm font-semibold text-highlighted">Admin</span>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          tooltip
          orientation="vertical"
          :items="nav"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel id="admin-main" :ui="{ body: 'flex flex-col' }">
      <template #header>
        <UDashboardNavbar title="Dashboard" />
      </template>

      <template #body>
        <div class="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
          <slot />
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
