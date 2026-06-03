<script setup lang="ts">
const { t } = useKbixLocale()
const { currency } = useCurrencyPrefs()
const { lines, subtotalThb, setQuantity, removeLine, clear } = useCart()
const { formattedPrice: subtotalFormatted } = useProductPrice(subtotalThb)

const lineRows = computed(() =>
  lines.value.map(line => ({
    ...line,
    formatted: formatKbixPrice(line.priceThb, currency.value),
    lineTotal: formatKbixPrice(line.priceThb * line.quantity, currency.value),
  })),
)
</script>

<template>
  <UContainer class="py-10 sm:py-12">
    <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
      {{ t('cart.title') }}
    </h1>

    <p
      v-if="!lines.length"
      class="mt-6 text-sm text-slate-500 dark:text-slate-400"
    >
      {{ t('cart.empty') }}
    </p>
    <UButton
      v-if="!lines.length"
      to="/"
      class="mt-6"
      color="primary"
      :label="t('cart.continueShopping')"
    />

    <div
      v-else
      class="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]"
    >
      <ul class="divide-y divide-slate-200/90 rounded-2xl border border-slate-200/90 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900/80">
        <li
          v-for="line in lineRows"
          :key="line.productId"
          class="flex gap-4 p-4 sm:gap-6 sm:p-5"
        >
          <NuxtLink
            :to="`/products/${line.productId}`"
            class="size-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:size-24"
          >
            <img
              v-if="line.imageUrl"
              :src="line.imageUrl"
              :alt="line.name"
              width="96"
              height="96"
              class="size-full object-cover"
            >
          </NuxtLink>
          <div class="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <NuxtLink
                :to="`/products/${line.productId}`"
                class="line-clamp-2 font-semibold text-slate-900 hover:text-green-700 dark:text-slate-100 dark:hover:text-green-400"
              >
                {{ line.name }}
              </NuxtLink>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {{ line.formatted }} × {{ line.quantity }}
              </p>
              <p class="text-sm font-bold tabular-nums text-slate-800 dark:text-slate-200">
                {{ line.lineTotal }}
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <UInput
                :model-value="line.quantity"
                type="number"
                min="1"
                class="w-20"
                @update:model-value="(v: number) => setQuantity(line.productId, Number(v))"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-trash-2"
                :aria-label="t('cart.remove')"
                @click="removeLine(line.productId)"
              />
            </div>
          </div>
        </li>
      </ul>

      <aside class="h-fit rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-900/60">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {{ t('cart.summary') }}
        </h2>
        <p class="mt-4 flex justify-between text-base font-bold text-slate-900 dark:text-slate-50">
          <span>{{ t('cart.subtotal') }}</span>
          <span class="tabular-nums">{{ subtotalFormatted }}</span>
        </p>
        <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {{ t('cart.checkoutHint') }}
        </p>
        <UButton
          class="mt-6 w-full"
          color="primary"
          size="lg"
          disabled
          :label="t('cart.checkoutSoon')"
        />
        <UButton
          class="mt-2 w-full"
          color="neutral"
          variant="ghost"
          :label="t('cart.clear')"
          @click="clear()"
        />
      </aside>
    </div>
  </UContainer>
</template>
