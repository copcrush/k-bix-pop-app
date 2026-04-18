<script setup lang="ts">
const { locale } = useKbixLocale()

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
}))
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
