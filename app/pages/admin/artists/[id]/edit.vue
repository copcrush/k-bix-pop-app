<script setup lang="ts">
import type { ArtistBrand } from '~/types/artistBrand'
import { isValidArtistHex, normalizeArtistHex } from '~/utils/artistBrand'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const route = useRoute()
const router = useRouter()
const { t } = useKbixLocale()
const { fetchById } = useArtistBrands()

const artistId = computed(() => String(route.params.id ?? ''))

const { data: artist, error: loadError, pending } = await useAsyncData(
  () => `admin-edit-artist-${artistId.value}`,
  () => fetchById(artistId.value),
  { watch: [artistId] },
)

const submitting = ref(false)
const formError = ref<string | null>(null)

const name = ref('')
const slug = ref('')
const colorStart = ref('#8b5cf6')
const colorEnd = ref('#06b6d4')
const useGradient = ref(true)
const gradientAngle = ref(135)
const loaded = ref(false)

watch(
  artist,
  (a) => {
    if (!a || loaded.value) return
    name.value = a.name
    slug.value = a.slug
    colorStart.value = a.color_start
    colorEnd.value = a.color_end ?? '#06b6d4'
    useGradient.value = !!a.color_end
    gradientAngle.value = a.gradient_angle ?? 135
    loaded.value = true
  },
  { immediate: true },
)

async function submit() {
  if (!artist.value) return
  formError.value = null

  if (!name.value.trim()) {
    formError.value = t('admin.artists.errors.nameRequired')
    return
  }
  if (!isValidArtistHex(colorStart.value)) {
    formError.value = t('admin.artists.errors.invalidColor')
    return
  }
  if (useGradient.value && colorEnd.value && !isValidArtistHex(colorEnd.value)) {
    formError.value = t('admin.artists.errors.invalidColor')
    return
  }

  submitting.value = true
  try {
    const row = {
      name: name.value.trim(),
      slug: slug.value.trim(),
      color_start: normalizeArtistHex(colorStart.value),
      color_end: useGradient.value && colorEnd.value
        ? normalizeArtistHex(colorEnd.value)
        : null,
      gradient_angle: gradientAngle.value,
      updated_at: new Date().toISOString(),
    }

    await $fetch(`/api/admin/artists/${artistId.value}`, {
      method: 'PATCH',
      body: row,
      headers: getKbixAdminAuthHeaders(),
    })

    await clearNuxtData(['artist-brands', 'admin-artist-list', `admin-edit-artist-${artistId.value}`])
    await router.push('/admin/artists')
  }
  catch (e) {
    formError.value = e instanceof Error ? e.message : t('common.errorGeneric')
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="admin-page mx-auto max-w-2xl p-6 lg:p-8">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {{ t('admin.artists.editTitle') }}
        </h1>
      </div>
      <UButton
        to="/admin/artists"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        :label="t('admin.artists.backToList')"
      />
    </div>

    <div
      v-if="pending"
      class="h-40 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"
    />

    <div
      v-else-if="loadError || !artist"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-800"
    >
      {{ loadError?.message ?? t('admin.artists.notFound') }}
    </div>

    <form
      v-else
      class="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
      @submit.prevent="submit"
    >
      <UFormField
        :label="t('admin.artists.fields.name')"
        required
      >
        <UInput
          v-model="name"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('admin.artists.fields.slug')">
        <UInput
          v-model="slug"
          size="lg"
          class="w-full font-mono text-sm"
        />
      </UFormField>

      <UCheckbox
        v-model="useGradient"
        :label="t('admin.artists.fields.useGradient')"
      />

      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField :label="t('admin.artists.fields.colorStart')">
          <div class="flex items-center gap-3">
            <input
              v-model="colorStart"
              type="color"
              class="size-10 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-600"
            >
            <UInput
              v-model="colorStart"
              class="flex-1 font-mono text-sm"
            />
          </div>
        </UFormField>

        <UFormField
          v-if="useGradient"
          :label="t('admin.artists.fields.colorEnd')"
        >
          <div class="flex items-center gap-3">
            <input
              v-model="colorEnd"
              type="color"
              class="size-10 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-600"
            >
            <UInput
              v-model="colorEnd"
              class="flex-1 font-mono text-sm"
            />
          </div>
        </UFormField>
      </div>

      <UFormField
        v-if="useGradient"
        :label="t('admin.artists.fields.angle')"
      >
        <div class="flex items-center gap-4">
          <input
            v-model.number="gradientAngle"
            type="range"
            min="0"
            max="360"
            class="flex-1"
          >
          <span class="w-12 text-right text-sm tabular-nums">{{ gradientAngle }}°</span>
        </div>
      </UFormField>

      <AdminArtistThemePreview
        :name="name"
        :color-start="colorStart"
        :color-end="colorEnd"
        :use-gradient="useGradient"
        :gradient-angle="gradientAngle"
      />

      <p
        v-if="formError"
        class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
      >
        {{ formError }}
      </p>

      <UButton
        type="submit"
        color="primary"
        size="lg"
        :loading="submitting"
        :label="t('admin.artists.save')"
      />
    </form>
  </div>
</template>
