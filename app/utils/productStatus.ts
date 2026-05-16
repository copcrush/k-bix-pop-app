import type { ProductStatus } from '~/types/catalogProduct'

export interface StatusBadgeStyle {
  label: string
  bg: string
  text: string
  ring: string
}

const STATUS_STYLES: Record<string, StatusBadgeStyle> = {
  'pre-order': {
    label: 'Pre-order',
    bg: 'bg-[#ffb710]/15',
    text: 'text-[#9a6b00] dark:text-[#ffc94d]',
    ring: 'ring-[#ffb710]/35',
  },
  'in-stock': {
    label: 'In stock',
    bg: 'bg-green-500/12',
    text: 'text-green-800 dark:text-green-300',
    ring: 'ring-green-500/25',
  },
  'sold-out': {
    label: 'Sold out',
    bg: 'bg-slate-500/12',
    text: 'text-slate-600 dark:text-slate-400',
    ring: 'ring-slate-400/25',
  },
}

export function getProductStatusBadge(status: ProductStatus): StatusBadgeStyle {
  const key = status.trim().toLowerCase()
  return STATUS_STYLES[key] ?? {
    label: status.replace(/-/g, ' '),
    bg: 'bg-slate-500/10',
    text: 'text-slate-700 dark:text-slate-300',
    ring: 'ring-slate-400/20',
  }
}

export const PRODUCT_STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pre-order', label: 'Pre-order' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'sold-out', label: 'Sold out' },
] as const

export type ProductStatusFilter = (typeof PRODUCT_STATUS_FILTERS)[number]['value']
