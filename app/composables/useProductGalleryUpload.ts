import { uploadProductImages } from '~/utils/productStorage'

export type GalleryPendingItem = {
  id: string
  file: File
  preview: string
}

const MAX_GALLERY_FILES = 40

export function useProductGalleryUpload(persistedUrls: Ref<string[]>) {
  const pending = ref<GalleryPendingItem[]>([])

  function revokePreview(item: GalleryPendingItem) {
    if (item.preview.startsWith('blob:')) {
      URL.revokeObjectURL(item.preview)
    }
  }

  function addFiles(files: FileList | File[]) {
    const images = Array.from(files).filter(f => f.type.startsWith('image/'))
    const slots = MAX_GALLERY_FILES - persistedUrls.value.length - pending.value.length
    if (slots <= 0) return
    for (const file of images.slice(0, slots)) {
      pending.value.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      })
    }
  }

  function removePersisted(url: string) {
    persistedUrls.value = persistedUrls.value.filter(u => u !== url)
  }

  function removePending(id: string) {
    const item = pending.value.find(p => p.id === id)
    if (item) revokePreview(item)
    pending.value = pending.value.filter(p => p.id !== id)
  }

  function clearPending() {
    for (const item of pending.value) revokePreview(item)
    pending.value = []
  }

  /** Merges kept URLs with newly uploaded files (detail_images array for DB). */
  async function resolveUrls(): Promise<string[]> {
    const kept = [...persistedUrls.value]
    if (!pending.value.length) return kept

    const uploaded = await uploadProductImages(pending.value.map(p => p.file))
    clearPending()
    return [...kept, ...uploaded]
  }

  const thumbnailItems = computed(() => [
    ...persistedUrls.value.map(url => ({ kind: 'persisted' as const, url })),
    ...pending.value.map(p => ({ kind: 'pending' as const, id: p.id, url: p.preview })),
  ])

  const totalCount = computed(() => persistedUrls.value.length + pending.value.length)
  const canAddMore = computed(() => totalCount.value < MAX_GALLERY_FILES)

  onUnmounted(() => clearPending())

  return {
    pending,
    addFiles,
    removePersisted,
    removePending,
    resolveUrls,
    thumbnailItems,
    totalCount,
    canAddMore,
    maxFiles: MAX_GALLERY_FILES,
  }
}
