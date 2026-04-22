<script setup lang="ts">
import { getKbixPopPublicApiClient, getKbixApiErrorMessage } from '~~/lib/axios/k-bix-pop-api'

definePageMeta({
  layout: 'auth',
})

const { t } = useKbixLocale()
const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const devToken = ref('')
const pending = ref(false)

async function onSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  devToken.value = ''
  pending.value = true
  try {
    const { data } = await getKbixPopPublicApiClient().post<{
      message: string
      devResetToken?: string
    }>('/auth/forgot-password', { email: email.value })
    successMessage.value = data.message
    if (data.devResetToken)
      devToken.value = data.devResetToken
  }
  catch (e: unknown) {
    errorMessage.value = getKbixApiErrorMessage(e, t('account.forgotFailed'))
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
        {{ t('account.forgotTitle') }}
      </h1>
      <p class="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
        {{ t('account.forgotSubtitle') }}
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

      <div
        v-if="devToken"
        class="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
      >
        <p class="font-semibold">
          {{ t('account.devTokenHint') }}
        </p>
        <p class="mt-1 break-all font-mono">
          {{ devToken }}
        </p>
        <UButton
          :to="`/reset-password?token=${encodeURIComponent(devToken)}`"
          size="xs"
          color="primary"
          class="mt-2"
        >
          {{ t('account.devOpenReset') }}
        </UButton>
      </div>

      <form class="mt-6 flex flex-col gap-4" @submit.prevent="onSubmit">
        <UFormField :label="t('login.emailLabel')" name="email" required>
          <UInput
            v-model="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            :placeholder="t('login.emailPlaceholder')"
            icon="i-lucide-mail"
            size="lg"
            class="w-full"
          />
        </UFormField>
        <UButton type="submit" color="primary" block size="lg" class="font-semibold" :loading="pending">
          {{ t('account.forgotSubmit') }}
        </UButton>
      </form>

      <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
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
