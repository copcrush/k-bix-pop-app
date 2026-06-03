export type ProductStatus =
  | 'pre-order'
  | 'imported'
  | 'restock'
  | 'out_of_stock'
  | string

export interface CatalogProduct {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  product_status: ProductStatus
  image_url: string | null
  detail_images: string[] | null
  artist_name: string | null
  created_at?: string
}

export interface CatalogProductInsert {
  name: string
  description: string | null
  price: number
  stock_quantity: number
  product_status: ProductStatus
  image_url: string | null
  detail_images: string[]
  artist_name: string | null
}
