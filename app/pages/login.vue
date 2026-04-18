<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const auth = useAuth()
const { t } = useKbixLocale()

async function onSubmit() {
  errorMessage.value = ''
  const res = await auth.login(email.value, password.value)
  if (res.ok) {
    await navigateTo('/')
    return
  }
  errorMessage.value = res.message
}
</script>

<template>
  <div class="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
    <div class="hidden flex-1 flex-col justify-center lg:flex">
      <p class="mb-3 text-xs font-medium tracking-widest text-fuchsia-600 uppercase dark:text-fuchsia-400">
        {{ t('login.heroBrand') }}
      </p>
      <h1 class="text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {{ t('login.heroTitle') }}
      </h1>
      <p class="mt-2 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {{ t('login.heroSubtitle') }}
      </p>
      <div class="clay-snippet mt-6 max-w-md space-y-4 p-5 text-sm leading-snug">
        <div class="flex gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-700 dark:text-green-400">
            <UIcon name="i-lucide-shopping-bag" class="size-5" />
          </span>
          <div>
            <p class="font-semibold text-slate-900 dark:text-white">
              {{ t('login.heroMerchTitle') }}
            </p>
            <p class="mt-0.5 text-slate-600 dark:text-slate-400">
              {{ t('login.heroMerchBody') }}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400">
            <UIcon name="i-lucide-package" class="size-5" />
          </span>
          <div>
            <p class="font-semibold text-slate-900 dark:text-white">
              {{ t('login.heroOrdersTitle') }}
            </p>
            <p class="mt-0.5 text-slate-600 dark:text-slate-400">
              {{ t('login.heroOrdersBody') }}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-700 dark:text-green-400">
            <UIcon name="i-lucide-sparkles" class="size-5" />
          </span>
          <div>
            <p class="font-semibold text-slate-900 dark:text-white">
              {{ t('login.heroDropsTitle') }}
            </p>
            <p class="mt-0.5 text-slate-600 dark:text-slate-400">
              {{ t('login.heroDropsBody') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto w-full max-w-md shrink-0 lg:mx-0 lg:w-[min(100%,28rem)]">
      <div class="mb-5 text-center lg:hidden">
        <p class="text-xs font-medium tracking-widest text-fuchsia-600 uppercase dark:text-fuchsia-400">
          {{ t('login.heroBrand') }}
        </p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {{ t('login.mobileTagline') }}
        </p>
      </div>

      <div class="clay-card px-6 py-8 sm:px-8 sm:py-9">
        <div class="mb-6 text-center lg:text-start">
          <p class="text-xs font-medium tracking-widest text-fuchsia-600 uppercase dark:text-fuchsia-400">
            {{ t('login.welcomeBack') }}
          </p>
          <h2 class="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            {{ t('login.title') }}
          </h2>
        </div>

        <p
          v-if="errorMessage"
          class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
        >
          {{ errorMessage }}
        </p>

        <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
          <UFormField :label="t('login.emailLabel')" name="email" required>
            <UInput
              v-model="email"
              type="email"
              inputmode="email"
              autocomplete="username"
              autocapitalize="off"
              autocorrect="off"
              :spellcheck="false"
              :placeholder="t('login.emailPlaceholder')"
              icon="i-lucide-mail"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('login.passwordLabel')" name="password" required>
            <UInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              autocapitalize="off"
              autocorrect="off"
              :spellcheck="false"
              :placeholder="t('login.passwordPlaceholder')"
              icon="i-lucide-lock"
              size="lg"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  type="button"
                  color="neutral"
                  variant="ghost"
                  square
                  size="sm"
                  class="-me-1"
                  :aria-pressed="showPassword"
                  :aria-label="showPassword ? t('login.hidePassword') : t('login.showPassword')"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  @click.prevent="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <div class="flex items-center justify-end">
            <ULink
              to="/forgot-password"
              inactive-class="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 dark:text-fuchsia-400 dark:hover:text-fuchsia-300"
            >
              {{ t('login.forgotPassword') }}
            </ULink>
          </div>

          <UButton
            type="submit"
            color="primary"
            block
            size="lg"
            class="mt-1 font-semibold"
            :loading="auth.pending"
          >
            {{ t('login.submit') }}
          </UButton>
        </form>

        <USeparator
          class="my-6"
          :label="t('login.socialSeparator')"
        />

        <!-- Full-width stack: card is ~max-w-md — 3 columns always clipped long provider names -->
        <div class="flex flex-col gap-2.5">
          <button
            type="button"
            :aria-label="t('login.oauthGoogleAria')"
            class="social-oauth-btn group"
          >
            <span class="social-oauth-icon-wrap">
              <UIcon
                name="i-simple-icons-google"
                class="size-[22px] text-slate-700 transition-transform duration-200 group-hover:scale-105 dark:text-slate-200"
              />
            </span>
            <span class="social-oauth-label">{{ t('login.oauthGoogle') }}</span>
          </button>
          <button
            type="button"
            :aria-label="t('login.oauthFacebookAria')"
            class="social-oauth-btn group"
          >
            <span class="social-oauth-icon-wrap">
              <UIcon
                name="i-simple-icons-facebook"
                class="size-[22px] text-[#1877F2] transition-transform duration-200 group-hover:scale-105"
              />
            </span>
            <span class="social-oauth-label">{{ t('login.oauthFacebook') }}</span>
          </button>
          <button
            type="button"
            :aria-label="t('login.oauthLineAria')"
            class="social-oauth-btn group"
          >
            <span class="social-oauth-icon-wrap">
              <UIcon
                name="i-simple-icons-line"
                class="size-[22px] text-[#06C755] transition-transform duration-200 group-hover:scale-105"
              />
            </span>
            <span class="social-oauth-label">{{ t('login.oauthLine') }}</span>
          </button>
        </div>

        <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          {{ t('login.newHere') }}
          <ULink
            to="/register"
            inactive-class="ms-1 font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            {{ t('login.createAccountLink') }}
          </ULink>
        </p>
      </div>
    </div>
  </div>
</template>
