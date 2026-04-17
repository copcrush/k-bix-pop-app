<template>
  <div class="relative isolate min-h-dvh overflow-hidden bg-slate-50 dark:bg-slate-950">
    <div
      class="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <div
        class="absolute -left-28 -top-20 size-[22rem] rounded-full bg-fuchsia-300/35 blur-3xl dark:bg-fuchsia-600/15"
      />
      <div
        class="absolute -right-20 top-1/4 size-[18rem] rounded-full bg-green-300/40 blur-3xl dark:bg-green-600/12"
      />
      <div
        class="absolute bottom-0 left-1/3 size-[20rem] rounded-full bg-fuchsia-200/25 blur-3xl dark:bg-green-900/20"
      />
    </div>
    <div class="relative z-10 flex min-h-dvh items-center justify-center px-4 py-12 sm:px-6">
      <div class="w-full max-w-lg lg:max-w-5xl">
        <slot />
      </div>
    </div>
  </div>
</template>
