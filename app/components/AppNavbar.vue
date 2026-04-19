<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Admin shell: slimmer actions, link back to storefront */
    variant?: 'default' | 'admin'
  }>(),
  { variant: 'default' },
)

const { t, locale, setLocale } = useKbixLocale()
const {
  user,
  isLoggedIn,
  isAdmin,
  roleLabelKey,
  displayName,
  initials,
  logout,
} = useAuth()
const shipping = useShippingPrefs()
const { currency } = useCurrencyPrefs()

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
    {
      label: t('nav.account'),
      icon: 'i-lucide-user',
      to: '/account',
    },
  ]

  const groups: MenuItem[][] = [accountItems]
  if (isAdmin.value) {
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
        await logout()
        await navigateTo('/')
      },
    },
  ])
  return groups
})

const roleBadgeText = computed(() => t(roleLabelKey.value))

const currencyLabelKeys = {
  THB: 'nav.currencyTHB',
  USD: 'nav.currencyUSD',
  KRW: 'nav.currencyKRW',
  JPY: 'nav.currencyJPY',
} as const

const currencyOptions = computed(() => {
  void locale.value
  return KBIX_CURRENCY_CODES.map((code) => ({
    value: code,
    label: t(currencyLabelKeys[code]),
    icon: KBIX_CURRENCY_FLAG_ICONS[code],
  }))
})
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

        <span class="hidden text-[0.7rem] font-semibold tracking-wide text-slate-500 uppercase lg:inline dark:text-slate-400">
          {{ t('nav.currency') }}
        </span>
        <div
          class="rounded-xl border border-slate-200/90 bg-slate-50/90 p-0.5 shadow-inner dark:border-slate-700 dark:bg-slate-900/90"
        >
          <USelect
            v-model="currency"
            :items="currencyOptions"
            value-key="value"
            label-key="label"
            size="xs"
            class="min-w-[6.25rem] max-w-[11rem] border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
            :ui="{
              base: 'h-auto min-h-8 items-center py-1.5',
              trailingIcon: 'shrink-0 text-slate-500 dark:text-slate-400',
              itemLabel: 'whitespace-normal break-words text-start leading-snug [overflow-wrap:anywhere]',
            }"
          >
            <template #default="{ modelValue, ui }">
              <span
                v-if="modelValue != null"
                data-slot="value"
                :class="
                  ui.value({
                    class:
                      'inline-flex min-w-0 items-center gap-1.5 whitespace-normal break-words text-start leading-snug [overflow-wrap:anywhere] pointer-events-none',
                  })
                "
              >
                <UIcon
                  :name="kbixCurrencyFlagIcon(String(modelValue))"
                  class="size-4 shrink-0 rounded-full ring-1 ring-slate-200/80 dark:ring-slate-600"
                />
                <span>{{ currencyOptions.find((o) => o.value === modelValue)?.label }}</span>
              </span>
              <span v-else data-slot="placeholder" :class="ui.placeholder({})">
                {{ '\xa0' }}
              </span>
            </template>
          </USelect>
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

        <template v-if="!isLoggedIn">
          <UButton
            to="/login"
            color="neutral"
            variant="outline"
            size="md"
            icon="i-lucide-log-in"
            class="rounded-full border-slate-200/90 px-3 font-semibold shadow-sm dark:border-slate-600"
          >
            <span class="max-w-[6.5rem] truncate sm:max-w-none">{{ t('nav.login') }}</span>
          </UButton>
          <UButton
            to="/register"
            color="primary"
            size="md"
            class="rounded-full px-3 font-bold shadow-sm shadow-green-900/10 sm:px-4"
          >
            {{ t('nav.register') }}
          </UButton>
        </template>

        <UDropdownMenu v-if="isLoggedIn" :items="userMenuItems" :content="{ align: 'end', sideOffset: 10 }">
          <template #content-top>
            <div
              class="flex flex-col items-center border-b border-slate-200/90 px-4 pb-4 pt-3 dark:border-slate-700/90"
            >
              <UAvatar
                :text="initials(user)"
                :alt="displayName(user)"
                size="3xl"
                class="size-16 shrink-0 bg-green-500/20 text-2xl font-semibold text-green-900 ring-2 ring-white shadow-sm dark:bg-green-500/30 dark:text-green-50 dark:ring-slate-900"
              />
              <p class="mt-3 max-w-[14rem] text-center text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50">
                {{ displayName(user) }}
              </p>
              <p class="mt-1 max-w-[14rem] break-all text-center text-xs leading-snug text-slate-500 dark:text-slate-400">
                {{ user?.email }}
              </p>
            </div>
          </template>
          <UButton
            color="neutral"
            variant="outline"
            size="md"
            class="h-auto min-h-11 max-w-[16rem] gap-2 rounded-full border-slate-200/90 bg-white/95 py-2 ps-2 pe-2.5 shadow-sm dark:border-slate-600 dark:bg-slate-900/75"
          >
            <UAvatar
              :text="initials(user)"
              size="sm"
              class="shrink-0 bg-green-500/20 text-green-900 dark:bg-green-500/30 dark:text-green-50"
            />
            <div class="min-w-0 flex-1 text-left leading-tight">
              <span class="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {{ displayName(user) }}
              </span>
              <!-- <UBadge color="neutral" variant="subtle" size="xs" class="mt-1 inline-flex max-w-full truncate font-semibold capitalize">
                {{ roleBadgeText }}
              </UBadge> -->
            </div>
            <UIcon name="i-lucide-chevron-down" class="size-4 shrink-0 self-center text-slate-400" />
          </UButton>
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>
