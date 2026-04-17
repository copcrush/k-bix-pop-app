const COUNTRIES = [
  { value: 'TH', label: 'Thailand' },
  { value: 'US', label: 'United States' },
  { value: 'KR', label: 'South Korea' },
  { value: 'JP', label: 'Japan' },
  { value: 'SG', label: 'Singapore' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'PH', label: 'Philippines' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'OTHER', label: 'Other' },
] as const

export function useShippingPrefs() {
  const country = useCookie<string>('kbix-ship-country', {
    default: () => 'TH',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })
  const addressLine = useCookie<string>('kbix-ship-address', {
    default: () => '',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  const countryOptions = COUNTRIES.map((c) => ({
    value: c.value,
    label: c.label,
  }))

  function countryLabel(code: string) {
    return COUNTRIES.find((c) => c.value === code)?.label ?? code
  }

  return {
    country,
    addressLine,
    countryOptions,
    countryLabel,
  }
}
