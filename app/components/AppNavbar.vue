<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Admin shell: slimmer actions, link back to storefront */
    variant?: 'default' | 'admin'
  }>(),
  { variant: 'default' },
)

const { t, locale, setLocale } = useKbixLocale()
const auth = useAuth()
const shipping = useShippingPrefs()

const shipOpen = ref(false)
const draftCountry = ref(shipping.country.value)
const draftAddress = ref(shipping.addressLine.value)

watch(shipOpen, (open) => {
  if (open) {
    draftCountry.value = shipping.country.value
    draftAddress.value = shipping.addressLine.value
  }
})

function saveShipping() {
  shipping.country.value = draftCountry.value
  shipping.addressLine.value = draftAddress.value
  shipOpen.value = false
}

const userMenuItems = computed(() => {
  void locale.value
  type MenuLabel = { type: 'label'; label: string }
  type MenuItem =
    | MenuLabel
    | {
        label: string
        icon?: string
        to?: string
        onSelect?: () => void | Promise<void>
      }

  const accountItems: MenuItem[] = [
    { type: 'label', label: t('nav.menuAccount') },
    {
      label: t('nav.editProfile'),
      icon: 'i-lucide-user-round-pen',
      to: '/account/profile',
    },
    {
      label: t('nav.changePassword'),
      icon: 'i-lucide-key-round',
      to: '/account/password',
    },
    {
      label: t('nav.resetPasswordHelp'),
      icon: 'i-lucide-mail-question',
      to: '/forgot-password',
    },
  ]

  const groups: MenuItem[][] = [accountItems]
  if (auth.isAdmin) {
    groups.push([
      { type: 'label', label: t('nav.menuAdministration') },
      {
        label: t('nav.admin'),
        icon: 'i-lucide-shield-check',
        to: '/admin',
      },
    ])
  }
  groups.push([
    {
      label: t('nav.logout'),
      icon: 'i-lucide-log-out',
      onSelect: async () => {
        await auth.logout()
        await navigateTo('/')
      },
    },
  ])
  return groups
})

const roleBadgeText = computed(() => t(auth.roleLabelKey))
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-slate-200/90 bg-linear-to-b from-white via-white to-green-50/40 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800/90 dark:from-slate-950 dark:via-slate-950 dark:to-green-950/30 dark:shadow-[0_12px_36px_-16px_rgba(0,0,0,0.75)]"
  >
    <div
      class="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3.5 sm:px-5 md:flex-nowrap md:gap-x-4 md:py-4"
    >
      <NuxtLink
        to="/"
        class="order-1 flex shrink-0 items-center gap-2.5 rounded-2xl px-1 py-0.5 transition-colors hover:bg-green-500/[0.08] dark:hover:bg-green-400/10"
      >
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-green-400 via-green-500 to-fuchsia-500 text-white shadow-md ring-2 ring-white/80 dark:ring-slate-900/80"
        >
          <UIcon name="i-lucide-sparkles" class="size-[1.35rem]" />
        </span>
        <span class="flex min-w-0 flex-col leading-tight">
          <span class="text-base font-bold tracking-tight text-green-700 sm:text-lg dark:text-green-400">
            {{ t('common.brand') }}
          </span>
          <span class="hidden max-w-[10rem] truncate text-[0.65rem] font-medium text-slate-500 sm:block dark:text-slate-400">
            {{ t('login.mobileTagline') }}
          </span>
        </span>
      </NuxtLink>

      <nav
        class="order-3 flex w-full basis-full items-center gap-1.5 border-t border-slate-200/80 pt-2.5 md:order-2 md:w-auto md:basis-auto md:gap-2 md:border-t-0 md:pt-0 dark:border-slate-800/80"
      >
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
          size="md"
          icon="i-lucide-home"
          class="rounded-full px-3 font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
        >
          <span class="hidden sm:inline">{{ t('nav.home') }}</span>
        </UButton>
        <UButton
          v-if="variant === 'default'"
          to="/cart"
          color="neutral"
          variant="ghost"
          size="md"
          icon="i-lucide-shopping-cart"
          class="rounded-full px-3 font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
        >
          <span class="hidden sm:inline">{{ t('nav.cart') }}</span>
        </UButton>
        <UButton
          v-if="variant === 'admin'"
          to="/"
          color="neutral"
          variant="ghost"
          size="md"
          icon="i-lucide-store"
          class="rounded-full px-3 font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
        >
          <span class="hidden sm:inline">{{ t('nav.home') }}</span>
        </UButton>
      </nav>

      <div
        class="order-2 ms-auto flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2 md:order-3"
      >
        <span class="hidden text-[0.7rem] font-semibold tracking-wide text-slate-500 uppercase lg:inline dark:text-slate-400">
          {{ t('nav.language') }}
        </span>
        <div
          class="kbix-locale-switch rounded-xl border border-slate-200/90 bg-slate-50/90 p-0.5 shadow-inner dark:border-slate-700 dark:bg-slate-900/90"
        >
          <span
            aria-hidden="true"
            class="kbix-locale-switch__pill"
            :style="{
              transform: locale === 'th' ? 'translateX(100%)' : 'translateX(0)',
            }"
          />
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            class="relative z-10 min-w-10 flex-1 rounded-lg px-2.5 font-bold transition-[color,transform] duration-200 [transition-timing-function:var(--ease-kbix-out)] active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100"
            :class="
              locale === 'en'
                ? 'text-green-900 dark:text-green-50'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
            "
            @click="setLocale('en')"
          >
            EN
          </UButton>
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            class="relative z-10 min-w-10 flex-1 rounded-lg px-2.5 font-bold transition-[color,transform] duration-200 [transition-timing-function:var(--ease-kbix-out)] active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100"
            :class="
              locale === 'th'
                ? 'text-green-900 dark:text-green-50'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
            "
            @click="setLocale('th')"
          >
            TH
          </UButton>
        </div>

        <UPopover v-model:open="shipOpen" :content="{ align: 'end', sideOffset: 8 }">
          <UButton
            color="neutral"
            variant="outline"
            size="md"
            icon="i-lucide-map-pin"
            class="rounded-full border-slate-200/90 bg-white/90 shadow-sm dark:border-slate-600 dark:bg-slate-900/70"
          >
            <span class="max-w-[7rem] truncate font-medium sm:max-w-[10rem]">{{ shipping.countryLabel(shipping.country) }}</span>
          </UButton>
          <template #content>
            <div class="w-72 space-y-3 p-3 sm:w-80">
              <p class="text-sm font-semibold text-slate-900 dark:text-white">
                {{ t('nav.shipTo') }}
              </p>
              <UFormField :label="t('nav.country')" name="ship-country">
                <USelect
                  v-model="draftCountry"
                  :items="shipping.countryOptions"
                  value-key="value"
                  label-key="label"
                  size="md"
                  class="w-full"
                />
              </UFormField>
              <UFormField :label="t('nav.address')" name="ship-address">
                <UTextarea
                  v-model="draftAddress"
                  :rows="3"
                  autoresize
                  :placeholder="t('nav.address')"
                  class="w-full"
                />
              </UFormField>
              <UButton color="primary" block @click="saveShipping">
                {{ t('nav.saveShipping') }}
              </UButton>
            </div>
          </template>
        </UPopover>

        <AppColorModeToggle />

        <template v-if="!auth.isLoggedIn">
          <UButton
            to="/login"
            color="neutral"
            variant="ghost"
            size="md"
            class="hidden rounded-full font-semibold sm:inline-flex"
          >
            {{ t('nav.login') }}
          </UButton>
          <UButton
            to="/register"
            color="primary"
            size="md"
            class="rounded-full px-4 font-bold shadow-sm shadow-green-900/10"
          >
            {{ t('nav.register') }}
          </UButton>
        </template>

        <UDropdownMenu v-else :items="userMenuItems" :content="{ align: 'end', sideOffset: 10 }">
          <UButton
            color="neutral"
            variant="outline"
            size="md"
            class="h-11 max-w-[14rem] rounded-full border-slate-200/90 bg-white/95 ps-1.5 pe-3 shadow-sm dark:border-slate-600 dark:bg-slate-900/75"
          >
            <UAvatar
              :text="auth.initials(auth.user)"
              size="sm"
              class="shrink-0 bg-green-500/20 text-green-900 dark:bg-green-500/30 dark:text-green-50"
            />
            <span class="min-w-0 truncate text-left text-sm font-semibold text-slate-800 dark:text-slate-100">
              {{ auth.displayName(auth.user) }}
            </span>
            <UBadge color="neutral" variant="subtle" size="xs" class="hidden shrink-0 font-semibold capitalize sm:inline-flex">
              {{ roleBadgeText }}
            </UBadge>
            <UIcon name="i-lucide-chevron-down" class="size-4 shrink-0 text-slate-400" />
          </UButton>
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>
