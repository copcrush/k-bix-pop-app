import type { ArtistBrand } from '~/types/artistBrand'
import type { CSSProperties } from 'vue'

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

export function slugifyArtistName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

export function isValidArtistHex(color: string): boolean {
  return HEX_RE.test(color.trim())
}

export function normalizeArtistHex(color: string): string {
  const c = color.trim()
  if (!HEX_RE.test(c)) return '#6366f1'
  if (c.length === 4) {
    const r = c[1]!
    const g = c[2]!
    const b = c[3]!
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  return c.toLowerCase()
}

export function findArtistBrand(
  artistName: string | null | undefined,
  brands: ArtistBrand[],
): ArtistBrand | null {
  if (!artistName?.trim()) return null
  const key = slugifyArtistName(artistName)
  return (
    brands.find(
      b => b.slug === key || slugifyArtistName(b.name) === key,
    ) ?? null
  )
}

export function artistBadgeStyle(brand: ArtistBrand): CSSProperties {
  const start = normalizeArtistHex(brand.color_start)
  const end = brand.color_end?.trim()
    ? normalizeArtistHex(brand.color_end)
    : null
  const angle = Number(brand.gradient_angle) || 135

  const background = end && end !== start
    ? `linear-gradient(${angle}deg, ${start}, ${end})`
    : start

  return {
    background,
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0,0,0,0.35)',
  }
}

export function artistChipStyle(brand: ArtistBrand): CSSProperties {
  return artistBadgeStyle(brand)
}
