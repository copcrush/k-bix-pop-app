export interface AdminNavItem {
  labelKey: string
  to: string
  icon: string
  badge?: number
}

export interface AdminNavGroup {
  labelKey: string
  items: AdminNavItem[]
}

export function useAdminNav() {
  const { t } = useKbixLocale()
  const route = useRoute()

  const menuGroups = computed((): AdminNavGroup[] => [
    {
      labelKey: 'admin.nav.menu',
      items: [
        { labelKey: 'admin.nav.dashboard', to: '/admin/dashboard', icon: 'i-lucide-layout-grid' },
        { labelKey: 'admin.nav.orders', to: '/admin/orders', icon: 'i-lucide-shopping-cart' },
        { labelKey: 'admin.nav.invoice', to: '/admin/invoice', icon: 'i-lucide-file-text' },
        { labelKey: 'admin.nav.confirmOrders', to: '/admin/confirm-orders', icon: 'i-lucide-circle-check' },
        { labelKey: 'admin.nav.customers', to: '/admin/customers', icon: 'i-lucide-users' },
        { labelKey: 'admin.nav.products', to: '/admin/products', icon: 'i-lucide-package' },
        { labelKey: 'admin.nav.inventory', to: '/admin/inventory', icon: 'i-lucide-layers' },
        { labelKey: 'admin.nav.messages', to: '/admin/messages', icon: 'i-lucide-message-circle', badge: 3 },
        { labelKey: 'admin.nav.returns', to: '/admin/returns', icon: 'i-lucide-undo-2' },
      ],
    },
    {
      labelKey: 'admin.nav.tools',
      items: [
        { labelKey: 'admin.nav.analytics', to: '/admin/analytics', icon: 'i-lucide-bar-chart-3' },
        { labelKey: 'admin.nav.promotions', to: '/admin/promotions', icon: 'i-lucide-percent' },
        { labelKey: 'admin.nav.integrations', to: '/admin/integrations', icon: 'i-lucide-puzzle' },
        { labelKey: 'admin.nav.settings', to: '/admin/settings', icon: 'i-lucide-settings' },
      ],
    },
  ])

  function isActive(to: string) {
    if (to === '/admin/orders' && route.path === '/admin') return true
    return route.path === to || route.path.startsWith(`${to}/`)
  }

  function labelFor(key: string) {
    return t(key)
  }

  return { menuGroups, isActive, labelFor }
}
