const PRODUCT_COLUMNS =
  'id, name, description, price, stock_quantity, product_status, image_url, detail_images, artist_name, created_at'

export default defineEventHandler(async (event) => {
  await requireKbixAdmin(event)

  const body = await readBody<Record<string, unknown>>(event)
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const price = Number(body.price)

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  }
  if (!Number.isFinite(price) || price < 0) {
    throw createError({ statusCode: 400, statusMessage: 'Price is required' })
  }

  const row = {
    name,
    description: typeof body.description === 'string' && body.description.trim()
      ? body.description.trim()
      : null,
    price,
    stock_quantity: Math.max(0, Math.floor(Number(body.stock_quantity) || 0)),
    product_status: typeof body.product_status === 'string' ? body.product_status : 'pre-order',
    image_url: typeof body.image_url === 'string' ? body.image_url : null,
    detail_images: Array.isArray(body.detail_images) ? body.detail_images : [],
    artist_name: typeof body.artist_name === 'string' && body.artist_name.trim()
      ? body.artist_name.trim()
      : null,
  }

  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('products')
    .insert(row)
    .select(PRODUCT_COLUMNS)
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
