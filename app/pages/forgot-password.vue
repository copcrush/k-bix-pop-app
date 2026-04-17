<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <div class="clay-card px-6 py-10 text-center sm:px-8">
    <h1 class="text-lg font-semibold text-slate-900 dark:text-white">
      Reset password
    </h1>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
      This step is not wired yet. Use this route when your API is ready.
    </p>
    <UButton to="/login" class="mt-6" color="primary" variant="soft">
      Back to sign in
    </UButton>
  </div>
</template>
