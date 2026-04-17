<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const nav = shallowRef<NavigationMenuItem[]>([
  { label: 'Home', to: '/' },
  { label: 'Admin', to: '/admin' }
])
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-default">
    <UHeader to="/">
      <template #title>
        <span class="font-semibold text-highlighted">Shop</span>
      </template>

      <UNavigationMenu :items="nav" />

      <template #right>
        <UButton to="/login" size="sm" color="neutral" variant="subtle">
          Login
        </UButton>
      </template>

      <template #body>
        <UNavigationMenu :items="nav" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain class="flex-1">
      <slot />
    </UMain>

    <UFooter>
      <span class="text-sm text-muted">Footer</span>
    </UFooter>
  </div>
</template>
