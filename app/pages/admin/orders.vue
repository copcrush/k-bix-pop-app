<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { ADMIN_ORDERS, ADMIN_ORDER_STATS, type AdminOrder } from '~/data/adminOrdersMocks'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { t } = useKbixLocale()

const table = useTemplateRef('ordersTable')
const showStats = ref(true)
const pageSize = ref(10)
const currentPage = ref(1)
const goToPage = ref('')

const pageSizeOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
]

const totalPages = computed(() => Math.max(1, Math.ceil(ADMIN_ORDERS.length / pageSize.value)))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return ADMIN_ORDERS.slice(start, start + pageSize.value)
})

const selectedCount = computed(() =>
  table.value?.tableApi?.getFilteredSelectedRowModel().rows.length ?? 0,
)

const selectedLabel = computed(() =>
  t('admin.orders.selected').replace('{count}', String(selectedCount.value)),
)

function clearSelection() {
  table.value?.tableApi?.resetRowSelection()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function customerInitials(name: string) {
  const parts = name.split(/\s+/)
  if (parts.length >= 2)
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function goToPageNumber() {
  const n = Number.parseInt(goToPage.value, 10)
  if (!Number.isFinite(n)) return
  currentPage.value = Math.min(Math.max(1, n), totalPages.value)
  goToPage.value = ''
}

const UCheckbox = resolveComponent('UCheckbox')
const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<AdminOrder>[] = [
  {
    id: 'select',
    header: ({ table: tbl }) => h(UCheckbox, {
      'modelValue': tbl.getIsSomePageRowsSelected() ? 'indeterminate' : tbl.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => tbl.toggleAllPageRowsSelected(!!value),
      'aria-label': t('admin.orders.selectAll'),
    }),
    cell: ({ row }) => h(UCheckbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
      'aria-label': t('admin.orders.selectRow'),
    }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: t('admin.orders.colOrder'),
    cell: ({ row }) => h('span', { class: 'font-medium text-slate-900' }, row.getValue('id') as string),
  },
  {
    accessorKey: 'date',
    header: t('admin.orders.colDate'),
    cell: ({ row }) => formatDate(row.getValue('date') as string),
  },
  {
    id: 'customer',
    header: t('admin.orders.colCustomer'),
    cell: ({ row }) => {
      const customer = row.original.customer
      return h('div', { class: 'flex items-center gap-2.5' }, [
        h(UAvatar, {
          alt: customer.name,
          text: customerInitials(customer.name),
          size: 'xs',
          class: 'shrink-0 bg-green-500/20 text-green-800 dark:bg-green-500/30 dark:text-green-50',
        }),
        h('span', { class: 'font-medium text-slate-800' }, customer.name),
      ])
    },
  },
  {
    accessorKey: 'delivery',
    header: t('admin.orders.colDelivery'),
  },
  {
    accessorKey: 'items',
    header: t('admin.orders.colItems'),
    cell: ({ row }) => String(row.getValue('items')),
  },
  {
    accessorKey: 'total',
    header: t('admin.orders.colTotal'),
    cell: ({ row }) => h('span', { class: 'font-semibold text-slate-900' }, formatMoney(row.getValue('total') as number)),
  },
  {
    id: 'payment',
    header: t('admin.orders.colPayment'),
    cell: ({ row }) => {
      const status = row.original.payment
      const isSuccess = status === 'success'
      return h(
        'span',
        {
          class: [
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
            isSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
          ],
        },
        [
          h('span', {
            class: ['size-1.5 rounded-full', isSuccess ? 'bg-emerald-500' : 'bg-amber-500'],
          }),
          isSuccess ? t('admin.orders.paymentSuccess') : t('admin.orders.paymentPending'),
        ],
      )
    },
  },
  {
    id: 'actions',
    header: '',
    cell: () => h(
      UDropdownMenu,
      {
        items: [[
          { label: t('admin.orders.actionView'), icon: 'i-lucide-eye' },
          { label: t('admin.orders.actionEdit'), icon: 'i-lucide-pencil' },
          { label: t('admin.orders.actionDelete'), icon: 'i-lucide-trash-2', color: 'error' as const },
        ]],
        content: { align: 'end' },
      },
      () => h(UButton, {
        icon: 'i-lucide-ellipsis-vertical',
        color: 'neutral',
        variant: 'ghost',
        size: 'xs',
        'aria-label': t('admin.orders.actions'),
      }),
    ),
    enableSorting: false,
  },
]

watch(pageSize, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="admin-page relative p-6 lg:p-8">
    <header class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {{ t('admin.orders.title') }}
      </h1>
      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-upload"
          :label="t('admin.orders.export')"
        />
        <UButton
          icon="i-lucide-plus"
          :label="t('admin.orders.create')"
          class="admin-primary-btn text-white"
        />
      </div>
    </header>

    <div class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div class="flex flex-wrap items-center gap-2">
        <USelect
          :items="[{ label: t('admin.orders.tableView'), value: 'table' }]"
          model-value="table"
          class="w-36"
        />
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-sliders-horizontal"
          :label="t('admin.orders.filter')"
        />
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-arrow-up-down"
          :label="t('admin.orders.sort')"
        />
        <div class="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3">
          <span class="text-sm text-slate-600">{{ t('admin.orders.showStats') }}</span>
          <USwitch v-model="showStats" />
        </div>
      </div>
      <div class="flex items-center gap-2 text-sm text-slate-500">
        <span>{{ t('admin.orders.lastUpdate') }}: 1 Oct 2024</span>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-refresh-cw"
          size="xs"
          :aria-label="t('admin.orders.refresh')"
        />
      </div>
    </div>

    <section
      v-if="showStats"
      class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <AdminStatCard
        v-for="stat in ADMIN_ORDER_STATS"
        :key="stat.key"
        :stat="stat"
      />
    </section>

    <section class="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <UTable
        ref="ordersTable"
        :data="paginatedOrders"
        :columns="columns"
        class="admin-orders-table"
      />
    </section>

    <footer class="mt-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2 text-sm text-slate-600">
        <span>{{ t('admin.orders.showPerPage') }}</span>
        <USelect
          v-model="pageSize"
          :items="pageSizeOptions"
          class="w-20"
        />
      </div>

      <div class="flex items-center gap-1">
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          :label="t('admin.orders.prev')"
          :disabled="currentPage <= 1"
          @click="currentPage--"
        />
        <button
          v-for="p in totalPages"
          :key="p"
          type="button"
          class="flex size-8 items-center justify-center rounded-full text-sm font-medium transition"
          :class="p === currentPage
            ? 'bg-green-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
          @click="currentPage = p"
        >
          {{ p }}
        </button>
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          :label="t('admin.orders.next')"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        />
      </div>

      <div class="flex items-center gap-2 text-sm text-slate-600">
        <span>{{ t('admin.orders.goToPage') }}</span>
        <UInput
          v-model="goToPage"
          type="number"
          class="w-16"
          min="1"
          :max="totalPages"
          @keyup.enter="goToPageNumber"
        />
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-lucide-chevron-right"
          :aria-label="t('admin.orders.goToPage')"
          @click="goToPageNumber"
        />
      </div>
    </footer>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="selectedCount > 0"
        class="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <span class="text-sm font-semibold text-slate-800">
          {{ selectedLabel }}
        </span>
        <span class="h-4 w-px bg-slate-200" />
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          :label="t('admin.orders.export')"
        />
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          :label="t('admin.orders.editInfo')"
        />
        <UButton
          color="error"
          variant="ghost"
          size="sm"
          icon="i-lucide-trash-2"
          :label="t('admin.orders.delete')"
        />
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-x"
          :aria-label="t('admin.orders.clearSelection')"
          @click="clearSelection"
        />
      </div>
    </Transition>
  </div>
</template>
