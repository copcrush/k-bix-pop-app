import type { AdminNavSectionDef } from '~/types/admin'

export const ADMIN_NAV_SECTIONS: AdminNavSectionDef[] = [
  {
    titleKey: 'admin.sections.overview',
    icon: 'i-lucide-layout-dashboard',
    roles: ['owner', 'staff', 'viewer'],
    items: [
      {
        labelKey: 'admin.nav.dashboard',
        href: '/admin/dashboard',
        icon: 'i-lucide-layout-dashboard',
        roles: ['owner', 'staff', 'viewer'],
      },
    ],
  },
  {
    titleKey: 'admin.sections.orders',
    icon: 'i-lucide-shopping-bag',
    roles: ['owner', 'staff', 'viewer'],
    items: [
      {
        labelKey: 'admin.nav.orderList',
        href: '/admin/orders',
        icon: 'i-lucide-shopping-bag',
        roles: ['owner', 'staff', 'viewer'],
      },
      {
        labelKey: 'admin.nav.orderDetail',
        href: '/admin/orders/detail',
        icon: 'i-lucide-file-text',
        roles: ['owner', 'staff', 'viewer'],
        inSidebar: false,
      },
      {
        labelKey: 'admin.nav.editOrder',
        href: '/admin/orders/edit',
        icon: 'i-lucide-pen-line',
        roles: ['owner', 'staff'],
        inSidebar: false,
      },
      {
        labelKey: 'admin.nav.createOrder',
        href: '/admin/orders/new',
        icon: 'i-lucide-plus-circle',
        roles: ['owner', 'staff'],
      },
      {
        labelKey: 'admin.nav.refunds',
        href: '/admin/orders/refunds',
        icon: 'i-lucide-corner-up-left',
        roles: ['owner', 'staff'],
      },
      {
        labelKey: 'admin.nav.exportOrders',
        href: '/admin/orders/export',
        icon: 'i-lucide-download',
        roles: ['owner'],
      },
    ],
  },
  {
    titleKey: 'admin.sections.preorders',
    icon: 'i-lucide-calendar-clock',
    roles: ['owner', 'staff', 'viewer'],
    items: [
      {
        labelKey: 'admin.nav.preorderCampaigns',
        href: '/admin/preorders',
        icon: 'i-lucide-calendar-clock',
        roles: ['owner', 'staff', 'viewer'],
      },
      {
        labelKey: 'admin.nav.preorderSlots',
        href: '/admin/preorders/slots',
        icon: 'i-lucide-users',
        roles: ['owner', 'staff'],
      },
      {
        labelKey: 'admin.nav.preorderFulfill',
        href: '/admin/preorders/fulfill',
        icon: 'i-lucide-send-horizontal',
        roles: ['owner', 'staff'],
      },
      {
        labelKey: 'admin.nav.preorderNotify',
        href: '/admin/preorders/notify',
        icon: 'i-lucide-bell',
        roles: ['owner', 'staff'],
      },
    ],
  },
  {
    titleKey: 'admin.sections.products',
    icon: 'i-lucide-layout-grid',
    roles: ['owner', 'staff', 'viewer'],
    items: [
      {
        labelKey: 'admin.nav.productList',
        href: '/admin/products',
        icon: 'i-lucide-layout-grid',
        roles: ['owner', 'staff', 'viewer'],
      },
      {
        labelKey: 'admin.nav.addProduct',
        href: '/admin/products/new',
        icon: 'i-lucide-package-plus',
        roles: ['owner', 'staff'],
      },
      {
        labelKey: 'admin.nav.artistThemes',
        href: '/admin/artists',
        icon: 'i-lucide-palette',
        roles: ['owner', 'staff'],
      },
      {
        labelKey: 'admin.nav.inventory',
        href: '/admin/inventory',
        icon: 'i-lucide-boxes',
        roles: ['owner', 'staff', 'viewer'],
      },
      {
        labelKey: 'admin.nav.categories',
        href: '/admin/categories',
        icon: 'i-lucide-tags',
        roles: ['owner', 'staff'],
      },
    ],
  },
  {
    titleKey: 'admin.sections.customers',
    icon: 'i-lucide-users-round',
    roles: ['owner', 'staff', 'viewer'],
    items: [
      {
        labelKey: 'admin.nav.customerList',
        href: '/admin/customers',
        icon: 'i-lucide-users-round',
        roles: ['owner', 'staff', 'viewer'],
      },
      {
        labelKey: 'admin.nav.customerProfile',
        href: '/admin/customers/profile',
        icon: 'i-lucide-user-circle',
        roles: ['owner', 'staff'],
        inSidebar: false,
      },
      {
        labelKey: 'admin.nav.fandomPoints',
        href: '/admin/customers/points',
        icon: 'i-lucide-star',
        roles: ['owner', 'staff'],
      },
      {
        labelKey: 'admin.nav.blocklist',
        href: '/admin/customers/blocklist',
        icon: 'i-lucide-ban',
        roles: ['owner'],
      },
    ],
  },
  {
    titleKey: 'admin.sections.promotions',
    icon: 'i-lucide-ticket',
    roles: ['owner', 'staff'],
    items: [
      {
        labelKey: 'admin.nav.discountCodes',
        href: '/admin/promotions/codes',
        icon: 'i-lucide-ticket',
        roles: ['owner', 'staff'],
      },
      {
        labelKey: 'admin.nav.flashSale',
        href: '/admin/promotions/flash',
        icon: 'i-lucide-zap',
        roles: ['owner', 'staff'],
      },
      {
        labelKey: 'admin.nav.bundles',
        href: '/admin/promotions/bundles',
        icon: 'i-lucide-package-open',
        roles: ['owner', 'staff'],
      },
      {
        labelKey: 'admin.nav.emailBlast',
        href: '/admin/promotions/email',
        icon: 'i-lucide-mail-check',
        roles: ['owner'],
      },
    ],
  },
  {
    titleKey: 'admin.sections.shipping',
    icon: 'i-lucide-truck',
    roles: ['owner', 'staff', 'viewer'],
    items: [
      {
        labelKey: 'admin.nav.shippingConfig',
        href: '/admin/shipping',
        icon: 'i-lucide-settings-2',
        roles: ['owner'],
      },
      {
        labelKey: 'admin.nav.orderTracking',
        href: '/admin/shipping/tracking',
        icon: 'i-lucide-map-pin',
        roles: ['owner', 'staff', 'viewer'],
      },
      {
        labelKey: 'admin.nav.packingSlips',
        href: '/admin/shipping/slips',
        icon: 'i-lucide-printer',
        roles: ['owner', 'staff'],
      },
    ],
  },
  {
    titleKey: 'admin.sections.reports',
    icon: 'i-lucide-trending-up',
    roles: ['owner', 'viewer'],
    items: [
      {
        labelKey: 'admin.nav.salesReport',
        href: '/admin/reports/sales',
        icon: 'i-lucide-trending-up',
        roles: ['owner', 'viewer'],
      },
      {
        labelKey: 'admin.nav.bestSellers',
        href: '/admin/reports/bestsellers',
        icon: 'i-lucide-trophy',
        roles: ['owner', 'viewer'],
      },
      {
        labelKey: 'admin.nav.stockReport',
        href: '/admin/reports/stock',
        icon: 'i-lucide-clipboard-list',
        roles: ['owner', 'viewer'],
      },
    ],
  },
  {
    titleKey: 'admin.sections.settings',
    icon: 'i-lucide-settings',
    roles: ['owner'],
    items: [
      {
        labelKey: 'admin.nav.adminUsers',
        href: '/admin/settings/users',
        icon: 'i-lucide-user-cog',
        roles: ['owner'],
      },
      {
        labelKey: 'admin.nav.storeSettings',
        href: '/admin/settings/store',
        icon: 'i-lucide-store',
        roles: ['owner'],
      },
      {
        labelKey: 'admin.nav.activityLog',
        href: '/admin/settings/log',
        icon: 'i-lucide-history',
        roles: ['owner'],
      },
    ],
  },
]

export function getAllAdminNavItems() {
  return ADMIN_NAV_SECTIONS.flatMap((s) => s.items)
}
