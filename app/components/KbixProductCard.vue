<script setup lang="ts">
import type { HomeProduct } from '~/data/homeLandingMocks'
import type { KbixCurrencyCode } from '~/composables/useCurrencyPrefs'

const props = defineProps<{
  product: HomeProduct
}>()

const { currency } = useCurrencyPrefs()
const { t } = useKbixLocale()

/** Demo conversion from THB shelf price — not real FX. */
const RATES_FROM_THB: Record<KbixCurrencyCode, number> = {
  THB: 1,
  USD: 0.029,
  KRW: 37,
  JPY: 4.5,
}

const displayAmount = computed(() => {
  const code = currency.value
  const raw = props.product.priceThb * RATES_FROM_THB[code]
  const rounded = code === 'THB' || code === 'KRW' || code === 'JPY'
    ? Math.round(raw)
    : Math.round(raw * 100) / 100
  return rounded
})

const formattedPrice = computed(() => {
  const locale = currency.value === 'JPY' ? 'ja-JP' : currency.value === 'KRW' ? 'ko-KR' : 'en-US'
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.value,
      maximumFractionDigits: currency.value === 'THB' || currency.value === 'KRW' || currency.value === 'JPY' ? 0 : 2,
    }).format(displayAmount.value)
  }
  catch {
    return `${displayAmount.value} ${currency.value}`
  }
})
</script>

<template>
  <article
    class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-200/60 transition-shadow hover:shadow-md dark:border-slate-700/90 dark:bg-slate-900/80 dark:ring-slate-700/80"
  >
    <NuxtLink
      :to="product.href"
      class="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800"
    >
      <img
        :src="product.image"
        :alt="product.title"
        width="600"
        height="600"
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
      >
    </NuxtLink>
    <div class="flex flex-1 flex-col gap-2 p-4">
      <div>
        <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {{ product.group }}
        </p>
        <NuxtLink
          :to="product.href"
          class="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors hover:text-green-700 dark:text-slate-100 dark:hover:text-green-400"
        >
          {{ product.title }}
        </NuxtLink>
      </div>
      <div class="mt-auto flex items-center justify-between gap-2 pt-1">
        <span class="text-base font-bold tabular-nums text-slate-900 dark:text-slate-50">
          {{ formattedPrice }}
        </span>
        <UButton
          color="primary"
          variant="soft"
          size="sm"
          square
          icon="i-lucide-shopping-cart"
          :aria-label="t('home.addToCart')"
          class="shrink-0"
          @click.prevent.stop
        />
      </div>
    </div>
  </article>
</template>
