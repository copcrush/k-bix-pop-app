import type { ArtistBrand, ArtistBrandInsert } from '~/types/artistBrand'
import { findArtistBrand, slugifyArtistName } from '~/utils/artistBrand'

const ARTIST_COLUMNS =
  'id, slug, name, color_start, color_end, gradient_angle, created_at, updated_at'

export function useArtistBrands() {
  const supabase = useSupabaseClient()

  async function fetchAll(): Promise<ArtistBrand[]> {
    const { data, error } = await supabase
      .from('artists')
      .select(ARTIST_COLUMNS)
      .order('name', { ascending: true })

    if (error) throw error
    return (data ?? []) as ArtistBrand[]
  }

  async function fetchById(id: string): Promise<ArtistBrand | null> {
    const { data, error } = await supabase
      .from('artists')
      .select(ARTIST_COLUMNS)
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return (data as ArtistBrand | null) ?? null
  }

  async function upsert(row: ArtistBrandInsert): Promise<ArtistBrand> {
    const { data, error } = await supabase
      .from('artists')
      .upsert(
        { ...row, updated_at: new Date().toISOString() },
        { onConflict: 'slug' },
      )
      .select(ARTIST_COLUMNS)
      .single()

    if (error) throw error
    return data as ArtistBrand
  }

  function matchBrand(
    artistName: string | null | undefined,
    brands: ArtistBrand[],
  ) {
    return findArtistBrand(artistName, brands)
  }

  function slugFromName(name: string) {
    return slugifyArtistName(name)
  }

  return {
    fetchAll,
    fetchById,
    upsert,
    matchBrand,
    slugFromName,
    ARTIST_COLUMNS,
  }
}
