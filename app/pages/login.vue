<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const password = ref('')
</script>

<template>
  <div class="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
    <div class="hidden flex-1 flex-col justify-center lg:flex">
      <p class="mb-3 text-xs font-medium tracking-widest text-fuchsia-600 uppercase dark:text-fuchsia-400">
        k-bix-pop
      </p>
      <h1 class="text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Your stage for K-pop picks
      </h1>
      <p class="mt-2 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Log in to shop official merch, albums, and concert goods — and keep every comeback on your radar.
      </p>
      <div class="clay-snippet mt-6 max-w-md space-y-4 p-5 text-sm leading-snug">
        <div class="flex gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-700 dark:text-green-400">
            <UIcon name="i-lucide-shopping-bag" class="size-5" />
          </span>
          <div>
            <p class="font-semibold text-slate-900 dark:text-white">
              Merch & albums
            </p>
            <p class="mt-0.5 text-slate-600 dark:text-slate-400">
              Official releases, lightsticks, and fan-made favorites.
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400">
            <UIcon name="i-lucide-package" class="size-5" />
          </span>
          <div>
            <p class="font-semibold text-slate-900 dark:text-white">
              Orders you can trust
            </p>
            <p class="mt-0.5 text-slate-600 dark:text-slate-400">
              Clear tracking from checkout to your doorstep.
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-700 dark:text-green-400">
            <UIcon name="i-lucide-sparkles" class="size-5" />
          </span>
          <div>
            <p class="font-semibold text-slate-900 dark:text-white">
              Drops & restocks
            </p>
            <p class="mt-0.5 text-slate-600 dark:text-slate-400">
              Wishlist bias picks and catch limited runs early.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto w-full max-w-md shrink-0 lg:mx-0 lg:w-[min(100%,28rem)]">
      <div class="mb-5 text-center lg:hidden">
        <p class="text-xs font-medium tracking-widest text-fuchsia-600 uppercase dark:text-fuchsia-400">
          k-bix-pop
        </p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          K-pop merch & drops
        </p>
      </div>

      <div class="clay-card px-6 py-8 sm:px-8 sm:py-9">
        <div class="mb-6 text-center lg:text-start">
          <h2 class="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            Sign in
          </h2>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent>
          <UFormField label="Email" name="email" required>
            <UInput
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="example@example.com"
              icon="i-lucide-mail"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Password" name="password" required>
            <UInput
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              icon="i-lucide-lock"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <div class="flex items-center justify-end">
            <ULink
              to="/forgot-password"
              inactive-class="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 dark:text-fuchsia-400 dark:hover:text-fuchsia-300"
            >
              Forgot password?
            </ULink>
          </div>

          <UButton
            type="submit"
            color="primary"
            block
            size="lg"
            class="mt-1 font-semibold"
          >
            Sign in
          </UButton>
        </form>

        <USeparator
          class="my-6"
          label="Or continue with"
        />

        <!-- Full-width stack: card is ~max-w-md — 3 columns always clipped long provider names -->
        <div class="flex flex-col gap-2.5">
          <button
            type="button"
            aria-label="Continue with Google"
            class="social-oauth-btn group"
          >
            <span class="social-oauth-icon-wrap">
              <UIcon
                name="i-simple-icons-google"
                class="size-[22px] text-slate-700 transition-transform duration-200 group-hover:scale-105 dark:text-slate-200"
              />
            </span>
            <span class="social-oauth-label">Google</span>
          </button>
          <button
            type="button"
            aria-label="Continue with Facebook"
            class="social-oauth-btn group"
          >
            <span class="social-oauth-icon-wrap">
              <UIcon
                name="i-simple-icons-facebook"
                class="size-[22px] text-[#1877F2] transition-transform duration-200 group-hover:scale-105"
              />
            </span>
            <span class="social-oauth-label">Facebook</span>
          </button>
          <button
            type="button"
            aria-label="Continue with LINE"
            class="social-oauth-btn group"
          >
            <span class="social-oauth-icon-wrap">
              <UIcon
                name="i-simple-icons-line"
                class="size-[22px] text-[#06C755] transition-transform duration-200 group-hover:scale-105"
              />
            </span>
            <span class="social-oauth-label">LINE</span>
          </button>
        </div>

        <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          New here?
          <ULink
            to="/register"
            inactive-class="ms-1 font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            Create account
          </ULink>
        </p>
      </div>
    </div>
  </div>
</template>
