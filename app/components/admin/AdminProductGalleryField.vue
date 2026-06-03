<script setup lang="ts">
const urls = defineModel<string[]>({ default: () => [] })

const { t } = useKbixLocale()
const {
  addFiles,
  removePersisted,
  removePending,
  resolveUrls,
  thumbnailItems,
  totalCount,
  canAddMore,
} = useProductGalleryUpload(urls)
const fileInputRef = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)

defineExpose({ resolveUrls })

function openPicker() {
  if (canAddMore.value) fileInputRef.value?.click()
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.length) addFiles(input.files)
  input.value = ''
}

function onDrop(event: DragEvent) {
  dragOver.value = false
  if (event.dataTransfer?.files?.length) addFiles(event.dataTransfer.files)
}

function onRemove(item: { kind: 'persisted', url: string } | { kind: 'pending', id: string }) {
  if (item.kind === 'persisted') removePersisted(item.url)
  else removePending(item.id)
}
</script>

<template>
  <UFormField :label="t('admin.products.fields.detailImages')">
    <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">
      {{ t('admin.products.fields.detailImagesHint') }}
    </p>

    <div
      v-if="thumbnailItems.length"
      class="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6"
    >
      <div
        v-for="(item, idx) in thumbnailItems"
        :key="item.kind === 'pending' ? item.id : item.url"
        class="relative aspect-square"
      >
        <img
          :src="item.url"
          :alt="t('admin.products.fields.detailImageAlt', { n: idx + 1 })"
          class="size-full rounded-lg border border-slate-200 object-cover dark:border-slate-600"
        >
        <span
          v-if="item.kind === 'pending'"
          class="absolute start-1 top-1 rounded-md bg-green-600/90 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-white"
        >
          {{ t('admin.products.fields.detailGalleryPending') }}
        </span>
        <button
          type="button"
          class="absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
          :aria-label="t('admin.products.removeImage')"
          @click="onRemove(item)"
        >
          <UIcon
            name="i-lucide-x"
            class="size-3"
          />
        </button>
      </div>
    </div>

    <p
      v-if="totalCount"
      class="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400"
    >
      {{ t('admin.products.fields.detailGalleryCount', { n: totalCount }) }}
    </p>

    <div
      role="button"
      tabindex="0"
      class="flex min-h-[7rem] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors"
      :class="
        dragOver
          ? 'border-green-500 bg-green-50/80 dark:border-green-400 dark:bg-green-950/40'
          : canAddMore
            ? 'border-slate-300 bg-slate-50/50 hover:border-green-400/70 hover:bg-green-50/40 dark:border-slate-600 dark:bg-slate-900/50 dark:hover:border-green-500/50'
            : 'cursor-not-allowed border-slate-200 bg-slate-100/80 opacity-60 dark:border-slate-700 dark:bg-slate-900/30'
      "
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
      @dragover.prevent="dragOver = canAddMore"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
    >
      <UIcon
        name="i-lucide-images"
        class="mb-2 size-8 text-slate-400 dark:text-slate-500"
      />
      <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
        {{ t('admin.products.fields.detailGalleryDrop') }}
      </p>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {{ t('admin.products.fields.detailGalleryFormats') }}
      </p>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      class="sr-only"
      :disabled="!canAddMore"
      @change="onFileChange"
    >

    <UButton
      v-if="canAddMore && thumbnailItems.length"
      type="button"
      color="neutral"
      variant="soft"
      size="sm"
      class="mt-2"
      icon="i-lucide-plus"
      :label="t('admin.products.fields.detailGalleryAddMore')"
      @click="openPicker"
    />
  </UFormField>
</template>
