export type AdminRole = 'owner' | 'staff' | 'viewer'

export interface AdminNavItemDef {
  labelKey: string
  href: string
  icon: string
  badge?: string
  roles: AdminRole[]
  inSidebar?: boolean
}

export interface AdminNavSectionDef {
  titleKey: string
  icon: string
  items: AdminNavItemDef[]
  roles: AdminRole[]
}
