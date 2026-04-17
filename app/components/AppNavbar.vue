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
  const groups: {
    label: string
    icon?: string
    to?: string
    onSelect?: () => void
  }[][] = []
  if (auth.isAdmin) {
    groups.push([
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
    class="sticky top-0 z-50 border-b border-slate-200/90 bg-white/85 backdrop-blur-md dark:border-slate-800/90 dark:bg-slate-950/90"
  >
    <div
      class="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2.5 sm:px-4 sm:py-3 md:flex-nowrap"
    >
      <NuxtLink
        to="/"
        class="order-1 shrink-0 rounded-lg px-1 py-0.5 text-sm font-bold tracking-tight text-green-600 sm:text-base dark:text-green-400"
      >
        k-bix-pop
      </NuxtLink>

      <nav
        class="order-3 flex w-full basis-full items-center gap-1 border-t border-slate-200/80 pt-2 md:order-2 md:w-auto md:basis-auto md:border-t-0 md:pt-0 dark:border-slate-800/80"
      >
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-home"
          class="font-medium"
        >
          <span class="hidden sm:inline">{{ t('nav.home') }}</span>
        </UButton>
        <UButton
          v-if="variant === 'default'"
          to="/cart"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-shopping-cart"
          class="font-medium"
        >
          <span class="hidden sm:inline">{{ t('nav.cart') }}</span>
        </UButton>
        <UButton
          v-if="variant === 'admin'"
          to="/"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-store"
          class="font-medium"
        >
          <span class="hidden sm:inline">{{ t('nav.home') }}</span>
        </UButton>
      </nav>

      <div
        class="order-2 ms-auto flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-1.5 md:order-3"
      >
        <span class="hidden text-xs font-medium text-slate-500 lg:inline dark:text-slate-400">
          {{ t('nav.language') }}
        </span>
        <div
          class="flex rounded-lg border border-slate-200 bg-slate-50/80 p-0.5 dark:border-slate-700 dark:bg-slate-900/80"
        >
          <UButton
            :color="locale === 'en' ? 'primary' : 'neutral'"
            :variant="locale === 'en' ? 'soft' : 'ghost'"
            size="xs"
            class="min-w-10 px-2 font-semibold"
            @click="setLocale('en')"
          >
            EN
          </UButton>
          <UButton
            :color="locale === 'th' ? 'primary' : 'neutral'"
            :variant="locale === 'th' ? 'soft' : 'ghost'"
            size="xs"
            class="min-w-10 px-2 font-semibold"
            @click="setLocale('th')"
          >
            TH
          </UButton>
        </div>

        <UPopover v-model:open="shipOpen" :content="{ align: 'end', sideOffset: 8 }">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-map-pin"
            class="border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/60"
          >
            <span class="max-w-[7rem] truncate sm:max-w-[10rem]">{{ shipping.countryLabel(shipping.country) }}</span>
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

        <UColorModeButton size="sm" />

        <template v-if="!auth.isLoggedIn">
          <UButton
            to="/login"
            color="neutral"
            variant="ghost"
            size="sm"
            class="hidden font-medium sm:inline-flex"
          >
            {{ t('nav.login') }}
          </UButton>
          <UButton
            to="/register"
            color="primary"
            size="sm"
            class="font-semibold"
          >
            {{ t('nav.register') }}
          </UButton>
        </template>

        <UDropdownMenu v-else :items="userMenuItems">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            class="border-slate-200 bg-white/80 ps-1 pe-2 dark:border-slate-700 dark:bg-slate-900/60"
          >
            <UAvatar
              :text="auth.initials(auth.user)"
              size="2xs"
              class="bg-green-500/20 text-green-800 dark:bg-green-500/30 dark:text-green-100"
            />
            <span class="max-w-[6rem] truncate text-left text-xs font-semibold sm:max-w-[9rem] sm:text-sm">
              {{ auth.displayName(auth.user) }}
            </span>
            <UBadge color="neutral" variant="subtle" size="xs" class="hidden font-medium capitalize sm:inline-flex">
              {{ roleBadgeText }}
            </UBadge>
          </UButton>
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>
