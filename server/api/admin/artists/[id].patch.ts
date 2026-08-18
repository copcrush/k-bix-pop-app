const ARTIST_COLUMNS =
  'id, slug, name, color_start, color_end, gradient_angle, created_at, updated_at'

export default defineEventHandler(async (event) => {
  await requireKbixAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Artist id is required' })
  }

  const body = await readBody<Record<string, unknown>>(event)
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const slug = typeof body.slug === 'string' ? body.slug.trim() : ''

  if (!name || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'Name and slug are required' })
  }

  const row = {
    name,
    slug,
    color_start: typeof body.color_start === 'string' ? body.color_start : '#6366f1',
    color_end: typeof body.color_end === 'string' && body.color_end ? body.color_end : null,
    gradient_angle: Number.isFinite(Number(body.gradient_angle)) ? Number(body.gradient_angle) : 135,
    updated_at: new Date().toISOString(),
  }

  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('artists')
    .update(row)
    .eq('id', id)
    .select(ARTIST_COLUMNS)
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
