<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const auth = useAuth()
const { t } = useKbixLocale()

const firstName = ref(auth.user?.firstName ?? '')
const lastName = ref(auth.user?.lastName ?? '')
const errorMessage = ref('')
const successMessage = ref('')
const saving = ref(false)

watch(
  () => auth.user,
  (u) => {
    if (!u) return
    firstName.value = u.firstName ?? ''
    lastName.value = u.lastName ?? ''
  },
  { immediate: true },
)

async function onSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  saving.value = true
  try {
    const res = await auth.updateProfile({
      firstName: firstName.value,
      lastName: lastName.value,
    })
    if (res.ok)
      successMessage.value = t('account.profileSaved')
    else
      errorMessage.value = res.message
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-lg px-4 py-10 sm:px-6">
    <div class="mb-8">
      <p class="text-xs font-medium tracking-widest text-fuchsia-600 uppercase dark:text-fuchsia-400">
        {{ t('account.eyebrow') }}
      </p>
      <h1 class="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {{ t('account.profileTitle') }}
      </h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {{ t('account.profileSubtitle') }}
      </p>
    </div>

    <div class="clay-card px-6 py-8 sm:px-8">
      <p
        v-if="errorMessage"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
      >
        {{ errorMessage }}
      </p>
      <p
        v-if="successMessage"
        class="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-100"
      >
        {{ successMessage }}
      </p>

      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <UFormField :label="t('signup.firstNameLabel')" name="firstName">
          <UInput v-model="firstName" autocomplete="given-name" class="w-full" />
        </UFormField>
        <UFormField :label="t('signup.lastNameLabel')" name="lastName">
          <UInput v-model="lastName" autocomplete="family-name" class="w-full" />
        </UFormField>
        <div class="mt-2 flex flex-wrap gap-2">
          <UButton type="submit" color="primary" :loading="saving">
            {{ t('account.save') }}
          </UButton>
          <UButton to="/" color="neutral" variant="ghost">
            {{ t('account.backHome') }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>
