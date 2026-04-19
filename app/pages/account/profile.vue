<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
await navigateTo('/account', { replace: true })
</script>

<template>
  <div class="min-h-[40vh]" />
</template>
