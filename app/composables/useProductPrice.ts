import type { KbixCurrencyCode } from '~/composables/useCurrencyPrefs'

/** Demo conversion from THB shelf price — not real FX. */
const RATES_FROM_THB: Record<KbixCurrencyCode, number> = {
  THB: 1,
  USD: 0.029,
  KRW: 37,
  JPY: 4.5,
}

function displayAmountFromThb(priceThb: number, code: KbixCurrencyCode): number {
  const raw = priceThb * RATES_FROM_THB[code]
  return code === 'THB' || code === 'KRW' || code === 'JPY'
    ? Math.round(raw)
    : Math.round(raw * 100) / 100
}

export function formatKbixPrice(priceThb: number, code: KbixCurrencyCode): string {
  const amount = displayAmountFromThb(priceThb, code)
  const locale = code === 'JPY' ? 'ja-JP' : code === 'KRW' ? 'ko-KR' : 'en-US'
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      maximumFractionDigits:
        code === 'THB' || code === 'KRW' || code === 'JPY' ? 0 : 2,
    }).format(amount)
  }
  catch {
    return `${amount} ${code}`
  }
}

export function useProductPrice(priceThb: MaybeRefOrGetter<number>) {
  const { currency } = useCurrencyPrefs()

  const displayAmount = computed(() =>
    displayAmountFromThb(toValue(priceThb), currency.value),
  )

  const formattedPrice = computed(() =>
    formatKbixPrice(toValue(priceThb), currency.value),
  )

  return { formattedPrice, displayAmount }
}
