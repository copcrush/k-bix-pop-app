import { ADMIN_NAV_SECTIONS, getAllAdminNavItems } from '~/config/adminNav'
import type { AdminNavItemDef, AdminNavSectionDef, AdminRole } from '~/types/admin'

export interface AdminNavItem {
  labelKey: string
  to: string
  icon: string
  badge?: string
}

export interface AdminNavSection {
  titleKey: string
  icon: string
  items: AdminNavItem[]
}

function roleCanAccess(roles: AdminRole[], role: AdminRole) {
  return roles.includes(role)
}

function filterSection(section: AdminNavSectionDef, role: AdminRole): AdminNavSection | null {
  if (!roleCanAccess(section.roles, role)) return null

  const items = section.items
    .filter((item) => roleCanAccess(item.roles, role) && item.inSidebar !== false)
    .map((item) => ({
      labelKey: item.labelKey,
      to: item.href,
      icon: item.icon,
      badge: item.badge,
    }))

  if (items.length === 0) return null

  return {
    titleKey: section.titleKey,
    icon: section.icon,
    items,
  }
}

export function useAdminNav() {
  const { t } = useKbixLocale()
  const route = useRoute()
  const adminRole = useAdminRole()

  const sections = computed(() =>
    ADMIN_NAV_SECTIONS
      .map((s) => filterSection(s, adminRole.value))
      .filter((s): s is AdminNavSection => s !== null),
  )

  const expandedSections = ref<Record<string, boolean>>({})

  function isSectionExpanded(titleKey: string) {
    return expandedSections.value[titleKey] !== false
  }

  function toggleSection(titleKey: string) {
    expandedSections.value[titleKey] = !isSectionExpanded(titleKey)
  }

  function isActive(href: string) {
    const path = route.path
    if (href === '/admin/dashboard' && (path === '/admin' || path === '/admin/dashboard')) {
      return true
    }
    if (path === href) return true
    if (!path.startsWith(`${href}/`)) return false

    const allItems = getAllAdminNavItems().filter((i) => i.inSidebar !== false)
    const moreSpecific = allItems.some(
      (item) =>
        item.href !== href
        && item.href.startsWith(`${href}/`)
        && (path === item.href || path.startsWith(`${item.href}/`)),
    )
    return !moreSpecific
  }

  function labelFor(key: string) {
    return t(key)
  }

  function titleKeyForPath(path: string): string | null {
    const items = getAllAdminNavItems()
    const exact = items.find((i) => i.href === path)
    if (exact) return exact.labelKey

    let best: AdminNavItemDef | null = null
    for (const item of items) {
      if (path === item.href || path.startsWith(`${item.href}/`)) {
        if (!best || item.href.length > best.href.length) best = item
      }
    }
    return best?.labelKey ?? null
  }

  return {
    sections,
    expandedSections,
    isSectionExpanded,
    toggleSection,
    isActive,
    labelFor,
    titleKeyForPath,
    adminRole,
  }
}
