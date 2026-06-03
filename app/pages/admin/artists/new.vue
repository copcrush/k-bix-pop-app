<script setup lang="ts">
import { isValidArtistHex, normalizeArtistHex, slugifyArtistName } from '~/utils/artistBrand'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { t } = useKbixLocale()
const { upsert, slugFromName } = useArtistBrands()
const router = useRouter()

const submitting = ref(false)
const formError = ref<string | null>(null)

const name = ref('')
const slug = ref('')
const slugTouched = ref(false)
const colorStart = ref('#8b5cf6')
const colorEnd = ref('#06b6d4')
const useGradient = ref(true)
const gradientAngle = ref(135)

watch(name, (v) => {
  if (!slugTouched.value) slug.value = slugFromName(v)
})

async function submit() {
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
    await upsert({
      slug: slug.value.trim() || slugifyArtistName(name.value),
      name: name.value.trim(),
      color_start: normalizeArtistHex(colorStart.value),
      color_end: useGradient.value && colorEnd.value
        ? normalizeArtistHex(colorEnd.value)
        : null,
      gradient_angle: gradientAngle.value,
    })
    await clearNuxtData('artist-brands')
    await clearNuxtData('admin-artist-list')
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
          {{ t('admin.artists.add') }}
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ t('admin.artists.addHint') }}
        </p>
      </div>
      <UButton
        to="/admin/artists"
        color="neutral"
        variant="ghost"
        icon="i-lucide-arrow-left"
        :label="t('admin.artists.backToList')"
      />
    </div>

    <form
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
          :placeholder="t('admin.artists.fields.namePlaceholder')"
          class="w-full"
        />
        <template #hint>
          {{ t('admin.artists.fields.nameHint') }}
        </template>
      </UFormField>

      <UFormField :label="t('admin.artists.fields.slug')">
        <UInput
          v-model="slug"
          size="lg"
          class="w-full font-mono text-sm"
          @input="slugTouched = true"
        />
        <template #hint>
          {{ t('admin.artists.fields.slugHint') }}
        </template>
      </UFormField>

      <div class="flex items-center gap-3">
        <UCheckbox
          v-model="useGradient"
          :label="t('admin.artists.fields.useGradient')"
        />
      </div>

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
          <span class="w-12 text-right text-sm tabular-nums text-slate-600 dark:text-slate-300">
            {{ gradientAngle }}°
          </span>
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
        class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
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
