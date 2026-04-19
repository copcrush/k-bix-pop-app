export const KBIX_CURRENCY_CODES = ['THB', 'USD', 'KRW', 'JPY'] as const
export type KbixCurrencyCode = (typeof KBIX_CURRENCY_CODES)[number]

function isKbixCurrency(code: string): code is KbixCurrencyCode {
  return (KBIX_CURRENCY_CODES as readonly string[]).includes(code)
}

/** Iconify ids (SVG) — visible on Windows; regional-flag emoji often are not. */
export const KBIX_CURRENCY_FLAG_ICONS = {
  THB: 'circle-flags:th',
  USD: 'circle-flags:us',
  KRW: 'circle-flags:kr',
  JPY: 'circle-flags:jp',
} as const satisfies Record<KbixCurrencyCode, string>

export function kbixCurrencyFlagIcon(code: string): string {
  return isKbixCurrency(code) ? KBIX_CURRENCY_FLAG_ICONS[code] : KBIX_CURRENCY_FLAG_ICONS.THB
}

export function useCurrencyPrefs() {
  const currencyCookie = useCookie<string>('kbix-currency', {
    default: () => 'THB',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  watch(
    currencyCookie,
    (v) => {
      if (v && !isKbixCurrency(v)) {
        currencyCookie.value = 'THB'
      }
    },
    { immediate: true },
  )

  const currency = computed({
    get(): KbixCurrencyCode {
      const v = currencyCookie.value ?? 'THB'
      return isKbixCurrency(v) ? v : 'THB'
    },
    set(v: KbixCurrencyCode) {
      currencyCookie.value = v
    },
  })

  return {
    currency,
  }
}
