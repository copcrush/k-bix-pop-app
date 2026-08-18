import { getKbixAdminAuthHeaders } from '~/utils/kbixAdminFetch'

export async function uploadProductImage(
  file: File,
  prefix = 'products',
): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  form.append('prefix', prefix)

  const res = await $fetch<{ publicUrl: string }>('/api/admin/storage', {
    method: 'POST',
    body: form,
    headers: getKbixAdminAuthHeaders(),
  })

  if (!res?.publicUrl) {
    throw new Error('Upload did not return a public URL')
  }
  return res.publicUrl
}

/** Upload many gallery images in parallel; stored as detail_images[] in Supabase. */
export async function uploadProductImages(
  files: File[],
  prefix = 'products/detail',
): Promise<string[]> {
  if (!files.length) return []
  return Promise.all(files.map(file => uploadProductImage(file, prefix)))
}
