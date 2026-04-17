<script setup lang="ts">
const { t } = useKbixLocale()
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-default">
    <AppNavbar />
    <UMain class="flex-1">
      <slot />
    </UMain>
    <UFooter>
      <span class="text-sm text-muted">{{ t('footer.tagline') }}</span>
    </UFooter>
  </div>
</template>
