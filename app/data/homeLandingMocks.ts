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
  { slug: 'aespa', label: 'aespa', initials: 'ae', markClass: 'from-fuchsia-500 to-violet-700' },
  { slug: 'illit', label: 'ILLIT', initials: 'I', markClass: 'from-emerald-400 to-teal-700' },
  { slug: 'cortis', label: 'CORTIS', initials: 'C', markClass: 'from-rose-400 to-pink-600' },
  { slug: 'le sserafim', label: 'LE SSERAFIM', initials: 'LS', markClass: 'from-emerald-400 to-teal-700' },
  { slug: 'babymonster', label: 'BABYMONSTER', initials: 'BM', markClass: 'from-pink-500 to-purple-700' },
  { slug: 'nmixx', label: 'NMIXX', initials: 'NM', markClass: 'from-sky-400 to-indigo-600' },
]

export const HOME_PRODUCTS: HomeProduct[] = [
  {
    id: 'p1',
    title: 'aespa - The 2nd Album LEMONADE (MUTANT Ver.)',
    group: 'Album',
    groupSlug: 'studio',
    tags: ['aespa'],
    priceThb: 1890,
    image: 'https://nzhtjvhedvemdyfspelp.supabase.co/storage/v1/object/public/k-bix-pop-stores/aespa-album-aespa-the-2nd-album-lemonade-mutant-ver.jpg',
    href: '/cart',
  },
  {
    id: 'p2',
    title: 'aespa - The 2nd Album LEMONADE (WDA Ver.)',
    group: 'Album',
    groupSlug: 'studio',
    tags: ['aespa'],
    priceThb: 220,
    image: 'https://nzhtjvhedvemdyfspelp.supabase.co/storage/v1/object/public/k-bix-pop-stores/aespa-album-aespa-the-2nd-album-lemonade-wda-ver.jpg',
    href: '/cart',
  },
  {
    id: 'p3',
    title: 'LE SSERAFIM - 2nd Studio Album ‘PUREFLOW’ pt.1',
    group: 'Album',
    groupSlug: 'studio',
    tags: ['le sserafim'],
    priceThb: 1290,
    image: 'https://nzhtjvhedvemdyfspelp.supabase.co/storage/v1/object/public/k-bix-pop-stores/lesserafim-album-the-2nd-studio-album-pureflow-pt.1.png',
    href: '/cart',
  },
  {
    id: 'p4',
    title: 'ILLIT - 4th Mini Album [MAMIHLAPINATAPAI]',
    group: 'EP',
    groupSlug: 'ep',
    tags: ['illit'],
    priceThb: 1290,
    image: 'https://nzhtjvhedvemdyfspelp.supabase.co/storage/v1/object/public/k-bix-pop-stores/illit-ep-the-4th-ep-1.jpg',
    href: '/cart',
  },
  {
    id: 'p5',
    title: 'ILLIT - 4th Mini Album [MAMIHLAPINATAPAI] (PAW PAW Ver.)',
    group: 'EP',
    groupSlug: 'ep',
    tags: ['illit'],
    priceThb: 1290,
    image: 'https://nzhtjvhedvemdyfspelp.supabase.co/storage/v1/object/public/k-bix-pop-stores/illit-ep-the-4th-ep-2.jpg',
    href: '/cart',
  },
  {
    id: 'p6',
    title: 'CORTIS - The 2nd EP GREENGREEN',
    group: 'EP',
    groupSlug: 'ep',
    tags: ['cortis'],
    priceThb: 1290,
    image: 'https://nzhtjvhedvemdyfspelp.supabase.co/storage/v1/object/public/k-bix-pop-stores/cortis-album-cortis-the-2nd-ep-greengreen-1232351361_700x.webp',
    href: '/cart',
  },
  {
    id: 'p7',
    title: 'BABYMONSTER - 3rd Mini Album CHOOM',
    group: 'EP',
    groupSlug: 'ep',
    tags: ['babymonster'],
    priceThb: 1290,
    image: 'https://nzhtjvhedvemdyfspelp.supabase.co/storage/v1/object/public/k-bix-pop-stores/baemon.png',
    href: '/cart',
  },
  {
    id: 'p8',
    title: 'NMIXX - 5th EP Heavy Serenade',
    group: 'EP',
    groupSlug: 'ep',
    tags: ['nmixx'],
    priceThb: 1290,
    image: 'https://nzhtjvhedvemdyfspelp.supabase.co/storage/v1/object/public/k-bix-pop-stores/nmixx-heavy.jpg',
    href: '/cart',
  },
]
