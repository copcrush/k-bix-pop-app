export interface ArtistBrand {
  id: string
  slug: string
  name: string
  color_start: string
  color_end: string | null
  gradient_angle: number
  created_at?: string
  updated_at?: string
}

export interface ArtistBrandInsert {
  slug: string
  name: string
  color_start: string
  color_end: string | null
  gradient_angle: number
}
