export type AdminOrderPaymentStatus = 'success' | 'pending'

export interface AdminOrder {
  id: string
  date: string
  customer: {
    name: string
    avatar?: string
  }
  delivery: string
  items: number
  total: number
  payment: AdminOrderPaymentStatus
}

export interface AdminOrderStat {
  key: string
  label: string
  value: number
  change: number
  sparkline: number[]
  color: string
}

export const ADMIN_ORDER_STATS: AdminOrderStat[] = [
  {
    key: 'total',
    label: 'Total Orders',
    value: 842,
    change: 16.8,
    sparkline: [12, 18, 14, 22, 19, 28, 24, 32, 29, 35, 31, 38],
    color: '#1fad58',
  },
  {
    key: 'cancel',
    label: 'Cancel Orders',
    value: 42,
    change: -4.2,
    sparkline: [8, 6, 9, 7, 5, 8, 6, 4, 5, 3, 4, 2],
    color: '#22c55e',
  },
  {
    key: 'pending',
    label: 'Pending Orders',
    value: 128,
    change: 8.4,
    sparkline: [4, 6, 8, 7, 10, 12, 11, 14, 13, 16, 15, 18],
    color: '#ef4444',
  },
  {
    key: 'returns',
    label: 'Returns Orders',
    value: 24,
    change: 2.1,
    sparkline: [2, 3, 2, 4, 3, 5, 4, 3, 4, 5, 4, 6],
    color: '#eab308',
  },
]

export const ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 'ORD-001',
    date: '2024-10-01',
    customer: { name: 'Esther Howard' },
    delivery: 'Standard',
    items: 3,
    total: 189.5,
    payment: 'success',
  },
  {
    id: 'ORD-002',
    date: '2024-10-01',
    customer: { name: 'Wade Warren' },
    delivery: 'Express',
    items: 1,
    total: 45.0,
    payment: 'pending',
  },
  {
    id: 'ORD-003',
    date: '2024-09-30',
    customer: { name: 'Jenny Wilson' },
    delivery: 'Standard',
    items: 2,
    total: 92.25,
    payment: 'success',
  },
  {
    id: 'ORD-004',
    date: '2024-09-30',
    customer: { name: 'Robert Fox' },
    delivery: 'Pickup',
    items: 5,
    total: 312.0,
    payment: 'success',
  },
  {
    id: 'ORD-005',
    date: '2024-09-29',
    customer: { name: 'Cameron Williamson' },
    delivery: 'Standard',
    items: 1,
    total: 28.99,
    payment: 'pending',
  },
  {
    id: 'ORD-006',
    date: '2024-09-29',
    customer: { name: 'Leslie Alexander' },
    delivery: 'Express',
    items: 4,
    total: 156.75,
    payment: 'success',
  },
  {
    id: 'ORD-007',
    date: '2024-09-28',
    customer: { name: 'Guy Hawkins' },
    delivery: 'Standard',
    items: 2,
    total: 67.5,
    payment: 'success',
  },
  {
    id: 'ORD-008',
    date: '2024-09-28',
    customer: { name: 'Kristin Watson' },
    delivery: 'Standard',
    items: 3,
    total: 124.0,
    payment: 'pending',
  },
  {
    id: 'ORD-009',
    date: '2024-09-27',
    customer: { name: 'Brooklyn Simmons' },
    delivery: 'Express',
    items: 1,
    total: 55.0,
    payment: 'success',
  },
  {
    id: 'ORD-010',
    date: '2024-09-27',
    customer: { name: 'Jacob Jones' },
    delivery: 'Standard',
    items: 6,
    total: 428.9,
    payment: 'success',
  },
]
