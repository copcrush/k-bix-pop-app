const BUCKET = 'k-bix-pop-stores'

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120)
}

export async function uploadProductImage(
  file: File,
  prefix = 'products',
): Promise<string> {
  const supabase = useSupabaseClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const base = sanitizeFileName(file.name.replace(/\.[^.]+$/, ''))
  const path = `${prefix}/${Date.now()}-${base}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
