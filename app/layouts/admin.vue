<template>
  <div
    class="admin-shell flex min-h-dvh bg-linear-to-b from-white via-white to-green-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-green-950/30"
  >
    <AdminSidebar />
    <main class="min-w-0 flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
