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
  imported: {
    label: 'Imported',
    bg: 'bg-sky-500/12',
    text: 'text-sky-800 dark:text-sky-300',
    ring: 'ring-sky-500/25',
  },
  restock: {
    label: 'Restock',
    bg: 'bg-green-500/12',
    text: 'text-green-800 dark:text-green-300',
    ring: 'ring-green-500/25',
  },
  out_of_stock: {
    label: 'Out of stock',
    bg: 'bg-slate-500/12',
    text: 'text-slate-600 dark:text-slate-400',
    ring: 'ring-slate-400/25',
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
    label: status.replace(/_/g, ' ').replace(/-/g, ' '),
    bg: 'bg-slate-500/10',
    text: 'text-slate-700 dark:text-slate-300',
    ring: 'ring-slate-400/20',
  }
}

export const PRODUCT_STATUS_OPTIONS = [
  { value: 'pre-order', label: 'Pre-order' },
  { value: 'imported', label: 'Imported' },
  { value: 'restock', label: 'Restock' },
  { value: 'out_of_stock', label: 'Out of stock' },
] as const

export const PRODUCT_STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  ...PRODUCT_STATUS_OPTIONS,
] as const

export type ProductStatusFilter = (typeof PRODUCT_STATUS_FILTERS)[number]['value']

export function isProductAvailable(status: ProductStatus): boolean {
  return status.trim().toLowerCase() !== 'out_of_stock'
}
