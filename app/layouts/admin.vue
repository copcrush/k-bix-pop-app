<script setup lang="ts">
const { isMobileOpen, closeMobile } = useSidebar()

watch(isMobileOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <div
    class="admin-shell flex min-h-dvh bg-linear-to-b from-white via-white to-green-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-green-950/30"
  >
    <AdminSidebar />

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isMobileOpen"
          class="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
          @click="closeMobile"
        />
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-200 ease-out"
        leave-active-class="transition-transform duration-200 ease-in"
        enter-from-class="-translate-x-full"
        leave-to-class="-translate-x-full"
      >
        <div
          v-if="isMobileOpen"
          class="fixed inset-y-0 start-0 z-50 lg:hidden"
        >
          <AdminSidebar mobile @navigate="closeMobile" />
        </div>
      </Transition>
    </Teleport>

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <AdminShellHeader />
      <main class="min-h-0 flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
