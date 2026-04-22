<script setup lang="ts">
import { getKbixPopPublicApiClient, getKbixApiErrorMessage } from '~~/lib/axios/k-bix-pop-api'

definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const { t } = useKbixLocale()

const token = ref(typeof route.query.token === 'string' ? route.query.token : '')
const password = ref('')
const confirm = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const pending = ref(false)

watch(
  () => route.query.token,
  (q) => {
    if (typeof q === 'string')
      token.value = q
  },
)

async function onSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!token.value.trim()) {
    errorMessage.value = t('account.resetTokenMissing')
    return
  }
  if (password.value !== confirm.value) {
    errorMessage.value = t('account.passwordMismatch')
    return
  }

  pending.value = true
  try {
    await getKbixPopPublicApiClient().post('/auth/reset-password', {
      token: token.value.trim(),
      password: password.value,
    })
    successMessage.value = t('account.resetSuccess')
    password.value = ''
    confirm.value = ''
  }
  catch (e: unknown) {
    errorMessage.value = getKbixApiErrorMessage(e, t('account.resetFailed'))
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-md">
    <div class="clay-card px-6 py-8 sm:px-8">
      <h1 class="text-center text-xl font-semibold text-slate-900 dark:text-white">
        {{ t('account.resetTitle') }}
      </h1>
      <p class="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
        {{ t('account.resetSubtitle') }}
      </p>

      <p
        v-if="errorMessage"
        class="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
      >
        {{ errorMessage }}
      </p>
      <p
        v-if="successMessage"
        class="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-100"
      >
        {{ successMessage }}
      </p>

      <form class="mt-6 flex flex-col gap-4" @submit.prevent="onSubmit">
        <UFormField :label="t('account.resetTokenLabel')" name="token" required>
          <UInput v-model="token" class="w-full" :placeholder="t('account.resetTokenPlaceholder')" />
        </UFormField>
        <UFormField :label="t('account.newPassword')" name="password" required>
          <UInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
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
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPassword ? t('login.hidePassword') : t('login.showPassword')"
                @click.prevent="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField :label="t('account.confirmPassword')" name="confirm" required>
          <UInput
            v-model="confirm"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="w-full"
          />
        </UFormField>
        <UButton type="submit" color="primary" block size="lg" class="mt-1 font-semibold" :loading="pending">
          {{ t('account.resetSubmit') }}
        </UButton>
      </form>

      <p class="mt-6 text-center text-sm">
        <ULink
          to="/login"
          inactive-class="font-medium text-fuchsia-600 hover:text-fuchsia-700 dark:text-fuchsia-400"
        >
          {{ t('account.backSignIn') }}
        </ULink>
      </p>
    </div>
  </div>
</template>
