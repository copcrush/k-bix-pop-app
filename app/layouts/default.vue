<script setup lang="ts">
const { t } = useKbixLocale()
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-default">
    <AppNavbar />
    <UMain class="flex-1">
      <slot />
    </UMain>
    <UFooter class="border-t border-slate-200/80 dark:border-slate-800">
      <div class="kbix-page flex flex-col gap-2 py-4">
        <span class="text-sm font-medium text-slate-800 dark:text-slate-200">
          {{ t('footer.tagline') }}
        </span>
        <p class="max-w-3xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {{ t('footer.disclaimer') }}
        </p>
      </div>
    </UFooter>
  </div>
</template>
