<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const auth = useAuth()
const { t } = useKbixLocale()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const saving = ref(false)

async function onSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = t('account.passwordMismatch')
    return
  }

  saving.value = true
  try {
    const res = await auth.changePassword(currentPassword.value, newPassword.value)
    if (res.ok) {
      successMessage.value = t('account.passwordChanged')
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    }
    else {
      errorMessage.value = res.message
    }
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
        {{ t('account.passwordTitle') }}
      </h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {{ t('account.passwordSubtitle') }}
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
        <UFormField :label="t('account.currentPassword')" name="current" required>
          <UInput
            v-model="currentPassword"
            :type="showCurrent ? 'text' : 'password'"
            autocomplete="current-password"
            class="w-full"
            icon="i-lucide-lock"
          >
            <template #trailing>
              <UButton
                type="button"
                color="neutral"
                variant="ghost"
                square
                size="sm"
                class="-me-1"
                :icon="showCurrent ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showCurrent ? t('login.hidePassword') : t('login.showPassword')"
                @click.prevent="showCurrent = !showCurrent"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField :label="t('account.newPassword')" name="new" required>
          <UInput
            v-model="newPassword"
            :type="showNew ? 'text' : 'password'"
            autocomplete="new-password"
            class="w-full"
            icon="i-lucide-key-round"
          >
            <template #trailing>
              <UButton
                type="button"
                color="neutral"
                variant="ghost"
                square
                size="sm"
                class="-me-1"
                :icon="showNew ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showNew ? t('login.hidePassword') : t('login.showPassword')"
                @click.prevent="showNew = !showNew"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField :label="t('account.confirmPassword')" name="confirm" required>
          <UInput
            v-model="confirmPassword"
            :type="showNew ? 'text' : 'password'"
            autocomplete="new-password"
            class="w-full"
            icon="i-lucide-lock-keyhole"
          />
        </UFormField>

        <div class="mt-2 flex flex-wrap gap-2">
          <UButton type="submit" color="primary" :loading="saving">
            {{ t('account.updatePassword') }}
          </UButton>
          <UButton to="/account/profile" color="neutral" variant="ghost">
            {{ t('account.editProfileLink') }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>
