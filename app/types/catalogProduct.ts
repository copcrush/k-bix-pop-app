export type ProductStatus = 'pre-order' | 'in-stock' | 'sold-out' | string

export interface CatalogProduct {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  product_status: ProductStatus
  image_url: string | null
  detail_images: string[] | null
  created_at?: string
}
