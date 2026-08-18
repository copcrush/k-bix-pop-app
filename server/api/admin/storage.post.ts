const BUCKET = 'k-bix-pop-stores'

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120)
}

export default defineEventHandler(async (event) => {
  await requireKbixAdmin(event)

  const form = await readMultipartFormData(event)
  const filePart = form?.find(part => part.name === 'file' && part.filename && part.data)
  const prefixPart = form?.find(part => part.name === 'prefix')

  if (!filePart?.data || !filePart.filename) {
    throw createError({ statusCode: 400, statusMessage: 'File is required' })
  }

  const prefix = prefixPart?.data?.toString().trim() || 'products'
  const ext = filePart.filename.split('.').pop()?.toLowerCase() || 'jpg'
  const base = sanitizeFileName(filePart.filename.replace(/\.[^.]+$/, ''))
  const path = `${prefix}/${Date.now()}-${base}.${ext}`

  const supabase = getSupabaseServiceClient()
  const { error } = await supabase.storage.from(BUCKET).upload(path, filePart.data, {
    cacheControl: '3600',
    upsert: false,
    contentType: filePart.type || undefined,
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { publicUrl: data.publicUrl }
})
