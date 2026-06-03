<script setup lang="ts">
const route = useRoute()
const { t } = useKbixLocale()
const { titleKeyForPath } = useAdminNav()

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const path = computed(() => `/admin/${(route.params.slug as string[]).join('/')}`)

const pageTitle = computed(() => {
  const key = titleKeyForPath(path.value)
  return key ? t(key) : t('admin.placeholder.title')
})
</script>

<template>
  <div class="admin-page p-6 lg:p-8">
    <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
      {{ pageTitle }}
    </h1>
    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
      {{ t('admin.placeholder.body') }}
    </p>
  </div>
</template>
