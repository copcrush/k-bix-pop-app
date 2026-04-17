<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const errorMessage = ref('')
const auth = useAuth()
const { t } = useKbixLocale()

async function onSubmit() {
  errorMessage.value = ''
  const res = await auth.register({
    email: email.value,
    password: password.value,
    firstName: firstName.value || undefined,
    lastName: lastName.value || undefined,
  })
  if (res.ok) {
    await navigateTo('/login')
    return
  }
  errorMessage.value = res.message
}
</script>

<template>
  <div class="mx-auto w-full max-w-md">
    <div class="clay-card px-6 py-8 sm:px-8 sm:py-9">
      <div class="mb-6 text-center lg:text-start">
        <p class="text-xs font-medium tracking-widest text-fuchsia-600 uppercase dark:text-fuchsia-400">
          {{ t('signup.eyebrow') }}
        </p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
          {{ t('signup.title') }}
        </h1>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {{ t('signup.subtitle') }}
        </p>
      </div>

      <p
        v-if="errorMessage"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
      >
        {{ errorMessage }}
      </p>

      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <UFormField :label="t('signup.emailLabel')" name="email" required>
          <UInput
            v-model="email"
            type="email"
            autocomplete="email"
            :placeholder="t('signup.emailPlaceholder')"
            icon="i-lucide-mail"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('signup.passwordLabel')" name="password" required>
          <UInput
            v-model="password"
            type="password"
            autocomplete="new-password"
            :placeholder="t('signup.passwordPlaceholder')"
            icon="i-lucide-lock"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UFormField :label="t('signup.firstNameLabel')" name="firstName">
            <UInput
              v-model="firstName"
              autocomplete="given-name"
              :placeholder="t('signup.optionalPlaceholder')"
              icon="i-lucide-user"
              size="lg"
              class="w-full"
            />
          </UFormField>
          <UFormField :label="t('signup.lastNameLabel')" name="lastName">
            <UInput
              v-model="lastName"
              autocomplete="family-name"
              :placeholder="t('signup.optionalPlaceholder')"
              icon="i-lucide-user"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <UButton
          type="submit"
          color="primary"
          block
          size="lg"
          class="mt-1 font-semibold"
          :loading="auth.pending"
        >
          {{ t('signup.submit') }}
        </UButton>
      </form>

      <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        {{ t('signup.alreadyHave') }}
        <ULink
          to="/login"
          inactive-class="ms-1 font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
        >
          {{ t('signup.signInLink') }}
        </ULink>
      </p>
    </div>
  </div>
</template>
