<script setup lang="ts">
const colorMode = useColorMode()
const appConfig = useAppConfig()
const { t } = useKbixLocale()

const iconName = computed(() =>
  colorMode.value === 'dark' ? appConfig.ui.icons.dark : appConfig.ui.icons.light,
)

const ariaLabel = computed(() =>
  colorMode.value === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark'),
)

function toggleColorMode() {
  const next = colorMode.value === 'dark' ? 'light' : 'dark'
  const apply = () => {
    colorMode.preference = next
  }

  if (!import.meta.client) {
    apply()
    return
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void }

  if (!reduceMotion && typeof doc.startViewTransition === 'function')
    doc.startViewTransition(apply)
  else
    apply()
}
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    size="md"
    square
    type="button"
    class="kbix-color-toggle inline-flex rounded-full !p-0 transition-transform duration-150 ease-in-out active:scale-[0.94] motion-reduce:transition-none motion-reduce:active:scale-100"
    :aria-label="ariaLabel"
    @click="toggleColorMode"
  >
    <span class="relative isolate inline-flex size-9 items-center justify-center">
      <Transition name="kbix-mode-icon">
        <span :key="colorMode.value" class="inline-flex items-center justify-center">
          <UIcon
            :name="iconName"
            class="size-[1.35rem] shrink-0 text-slate-700 dark:text-slate-200"
          />
        </span>
      </Transition>
    </span>
  </UButton>
</template>
