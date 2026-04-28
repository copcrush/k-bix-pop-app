export interface HomePopularGroup {
  slug: string
  label: string
  initials: string
  markClass: string
}

export interface HomeProduct {
  id: string
  title: string
  group: string
  groupSlug: string
  tags?: string[]
  priceThb: number
  image: string
  href: string
}

export const HOME_POPULAR_GROUPS: HomePopularGroup[] = [
  { slug: 'bts', label: 'BTS', initials: 'B', markClass: 'from-violet-500 to-purple-700' },
  { slug: 'bp', label: 'BLACKPINK', initials: 'BP', markClass: 'from-pink-500 to-rose-700' },
  { slug: 'ive', label: 'IVE', initials: 'I', markClass: 'from-sky-400 to-indigo-600' },
  { slug: 'svt', label: 'SEVENTEEN', initials: '17', markClass: 'from-amber-400 to-orange-600' },
  { slug: 'aespa', label: 'aespa', initials: 'ae', markClass: 'from-fuchsia-500 to-violet-700' },
  { slug: 'idle', label: 'I-DLE', initials: 'I', markClass: 'from-emerald-400 to-teal-700' },
  { slug: 'twice', label: 'TWICE', initials: 'TW', markClass: 'from-rose-400 to-pink-600' },
  { slug: 'skz', label: 'Stray Kids', initials: 'SKZ', markClass: 'from-red-500 to-red-900' },
]

export const HOME_PRODUCTS: HomeProduct[] = [
  {
    id: 'p1',
    title: 'aespa - The 2nd Album [LEMONADE]',
    group: 'Album',
    groupSlug: 'studio',
    tags: ['aespa'],
    priceThb: 1890,
    image: 'https://picsum.photos/seed/kbixpd1/600/600',
    href: '/cart',
  },
  {
    id: 'p2',
    title: 'LE SSERAFIM - 2nd Studio Album ‘PUREFLOW’ pt.1',
    group: 'Album',
    groupSlug: 'studio',
    tags: ['le sserafim'],
    priceThb: 1290,
    image: 'https://picsum.photos/seed/kbixpd2/600/600',
    href: '/cart',
  },
  {
    id: 'p3',
    title: 'Hall Run Tour Tee',
    group: 'Live Capsule',
    groupSlug: 'live',
    tags: ['svt', 'skz'],
    priceThb: 990,
    image: 'https://picsum.photos/seed/kbixpd3/600/600',
    href: '/cart',
  },
  {
    id: 'p4',
    title: 'Sticker Pack Vol.3',
    group: 'Archive Series',
    groupSlug: 'archive',
    tags: ['aespa'],
    priceThb: 220,
    image: 'https://picsum.photos/seed/kbixpd4/600/600',
    href: '/cart',
  },
  {
    id: 'p5',
    title: 'Lightstick Pouch',
    group: 'Live Capsule',
    groupSlug: 'live',
    tags: ['twice'],
    priceThb: 650,
    image: 'https://picsum.photos/seed/kbixpd5/600/600',
    href: '/cart',
  },
  {
    id: 'p6',
    title: 'Season Greetings Box',
    group: 'Studio Drop',
    groupSlug: 'studio',
    tags: ['idle'],
    priceThb: 2490,
    image: 'https://picsum.photos/seed/kbixpd6/600/600',
    href: '/cart',
  },
  {
    id: 'p7',
    title: 'Keycap Set — Pastel',
    group: 'Archive Series',
    groupSlug: 'archive',
    tags: ['nj', 'bp'],
    priceThb: 1590,
    image: 'https://picsum.photos/seed/kbixpd7/600/600',
    href: '/cart',
  },
  {
    id: 'p8',
    title: 'Holo Photocard Frame',
    group: 'Studio Drop',
    groupSlug: 'studio',
    tags: ['bts', 'svt'],
    priceThb: 180,
    image: 'https://picsum.photos/seed/kbixpd8/600/600',
    href: '/cart',
  },
]
