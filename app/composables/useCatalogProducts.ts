import type { CatalogProduct } from '~/types/catalogProduct'

const PRODUCT_COLUMNS =
  'id, name, description, price, stock_quantity, product_status, image_url, detail_images, artist_name, created_at'

export function useCatalogProducts() {
  const supabase = useSupabaseClient()

  async function fetchAll(): Promise<CatalogProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []) as CatalogProduct[]
  }

  async function fetchById(id: string): Promise<CatalogProduct | null> {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return (data as CatalogProduct | null) ?? null
  }

  return { fetchAll, fetchById, PRODUCT_COLUMNS }
}
