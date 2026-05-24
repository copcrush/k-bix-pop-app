<script setup lang="ts">
const route = useRoute()
const { t } = useKbixLocale()

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const section = computed(() => String(route.params.section ?? ''))

const titleKey = computed(() => {
  const map: Record<string, string> = {
    dashboard: 'admin.nav.dashboard',
    invoice: 'admin.nav.invoice',
    'confirm-orders': 'admin.nav.confirmOrders',
    customers: 'admin.nav.customers',
    products: 'admin.nav.products',
    inventory: 'admin.nav.inventory',
    messages: 'admin.nav.messages',
    returns: 'admin.nav.returns',
    analytics: 'admin.nav.analytics',
    promotions: 'admin.nav.promotions',
    integrations: 'admin.nav.integrations',
    settings: 'admin.nav.settings',
  }
  return map[section.value] ?? 'admin.placeholder.title'
})

const pageTitle = computed(() => t(titleKey.value))
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
