import en from '~~/locales/en.json'
import th from '~~/locales/th.json'

export type KbixLocale = 'en' | 'th'

const catalogs: Record<KbixLocale, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  th: th as Record<string, unknown>,
}

function lookupString(root: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.')
  let cur: unknown = root
  for (const p of parts) {
    if (cur !== null && typeof cur === 'object' && p in cur)
      cur = (cur as Record<string, unknown>)[p]
    else
      return undefined
  }
  return typeof cur === 'string' ? cur : undefined
}

export function useKbixLocale() {
  const locale = useCookie<KbixLocale>('kbix-locale', {
    default: () => 'en',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  function setLocale(next: KbixLocale) {
    locale.value = next
  }

  /** Dot-path keys, e.g. `nav.home`, `login.title` */
  function t(path: string): string {
    const active = catalogs[locale.value] ?? catalogs.en
    const fromActive = lookupString(active, path)
    if (fromActive !== undefined)
      return fromActive
    const fromEn = lookupString(catalogs.en, path)
    if (fromEn !== undefined)
      return fromEn
    return path
  }

  return { locale, setLocale, t }
}
