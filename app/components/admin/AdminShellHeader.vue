<script setup lang="ts">
const { t } = useKbixLocale()
const { openMobile } = useSidebar()
</script>

<template>
  <header
    class="flex items-center gap-3 border-b border-slate-200/90 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-950/95 lg:hidden"
  >
    <UButton
      color="neutral"
      variant="ghost"
      size="md"
      icon="i-lucide-menu"
      class="text-slate-600 dark:text-slate-300"
      :aria-label="t('admin.openMenu')"
      @click="openMobile"
    />
    <span class="text-sm font-bold tracking-tight text-green-700 dark:text-green-400">
      {{ t('admin.brand') }}
    </span>
  </header>
</template>
