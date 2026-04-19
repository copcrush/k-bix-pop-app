<script setup lang="ts">
import type { Address } from '~/types/address'

definePageMeta({
  middleware: 'auth',
  layout: 'auth',
})

const { t } = useKbixLocale()
const toast = useToast()
const { user, updateManageUser, refreshUser } = useAuth()
const addrApi = useAddresses()

const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const addresses = ref<Address[]>([])
const addressesLoading = ref(true)

const addressOpen = ref(false)
const editingId = ref<string | null>(null)
const addrLabel = ref('')
const addrRecipient = ref('')
const addrLine1 = ref('')
const addrLine2 = ref('')
const addrCity = ref('')
const addrState = ref('')
const addrPostal = ref('')
const addrCountry = ref('')
const addrIsDefault = ref(false)
const addressSaving = ref(false)

const savingProfile = ref(false)

function syncFromUser(u: typeof user.value) {
  if (!u) return
  firstName.value = u.firstName ?? ''
  lastName.value = u.lastName ?? ''
  phone.value = u.phone ?? ''
}

watch(user, syncFromUser, { immediate: true })

function passwordPolicyOk(p: string) {
  return (
    p.length >= 8
    && /[a-z]/.test(p)
    && /[A-Z]/.test(p)
    && /\d/.test(p)
  )
}

async function loadAddresses() {
  addressesLoading.value = true
  try {
    addresses.value = await addrApi.list()
  }
  catch {
    toast.add({ title: t('common.errorGeneric'), color: 'error' })
    addresses.value = []
  }
  finally {
    addressesLoading.value = false
  }
}

onMounted(async () => {
  await refreshUser()
  await loadAddresses()
})

async function onSaveProfile() {
  const wantsPwd = Boolean(
    newPassword.value || confirmPassword.value || currentPassword.value,
  )
  if (wantsPwd) {
    if (!currentPassword.value) {
      toast.add({
        title: t('account.currentPassword'),
        description: t('account.passwordOptionalHint'),
        color: 'error',
      })
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      toast.add({ title: t('account.validationPasswordMatch'), color: 'error' })
      return
    }
    if (!passwordPolicyOk(newPassword.value)) {
      toast.add({ title: t('account.validationPasswordPolicy'), color: 'error' })
      return
    }
  }

  savingProfile.value = true
  const payload: {
    firstName: string
    lastName: string
    phone: string | null
    currentPassword?: string
    newPassword?: string
  } = {
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phone.value.trim() || null,
  }
  if (newPassword.value) {
    payload.currentPassword = currentPassword.value
    payload.newPassword = newPassword.value
  }

  const res = await updateManageUser(payload)
  savingProfile.value = false

  if (!res.ok) {
    toast.add({ title: res.message, color: 'error' })
    return
  }

  toast.add({ title: t('account.profileAndSecuritySaved'), color: 'success' })
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

function resetAddressForm() {
  addrLabel.value = ''
  addrRecipient.value = ''
  addrLine1.value = ''
  addrLine2.value = ''
  addrCity.value = ''
  addrState.value = ''
  addrPostal.value = ''
  addrCountry.value = ''
  addrIsDefault.value = false
}

function openNewAddress() {
  editingId.value = null
  resetAddressForm()
  addrIsDefault.value = addresses.value.length === 0
  addressOpen.value = true
}

function openEditAddress(a: Address) {
  editingId.value = a.id
  addrLabel.value = a.label ?? ''
  addrRecipient.value = a.recipientName
  addrLine1.value = a.line1
  addrLine2.value = a.line2 ?? ''
  addrCity.value = a.city
  addrState.value = a.stateRegion ?? ''
  addrPostal.value = a.postalCode
  addrCountry.value = a.country
  addrIsDefault.value = a.isDefault
  addressOpen.value = true
}

function validateAddressForm() {
  const c = addrCountry.value.trim().toUpperCase()
  if (c.length !== 2) {
    toast.add({ title: t('account.validationCountry'), color: 'error' })
    return false
  }
  if (
    !addrRecipient.value.trim()
    || !addrLine1.value.trim()
    || !addrCity.value.trim()
    || !addrPostal.value.trim()
  ) {
    toast.add({ title: t('account.validationAddress'), color: 'error' })
    return false
  }
  return true
}

async function onSaveAddress() {
  if (!validateAddressForm())
    return

  addressSaving.value = true
  const body = {
    label: addrLabel.value.trim() || undefined,
    recipientName: addrRecipient.value.trim(),
    line1: addrLine1.value.trim(),
    line2: addrLine2.value.trim() || undefined,
    city: addrCity.value.trim(),
    stateRegion: addrState.value.trim() || undefined,
    postalCode: addrPostal.value.trim(),
    country: addrCountry.value.trim().toUpperCase(),
    isDefault: addrIsDefault.value,
  }

  const res = editingId.value
    ? await addrApi.update(editingId.value, body)
    : await addrApi.create(body)

  addressSaving.value = false

  if (!res.ok) {
    toast.add({ title: res.message, color: 'error' })
    return
  }

  toast.add({ title: t('account.addressSaved'), color: 'success' })
  addressOpen.value = false
  await loadAddresses()
}

async function onDeleteAddress(id: string) {
  if (!import.meta.client)
    return
  if (!window.confirm(t('account.addressDeleteConfirm')))
    return
  const res = await addrApi.remove(id)
  if (!res.ok) {
    toast.add({ title: res.message, color: 'error' })
    return
  }
  toast.add({ title: t('account.addressDeleted'), color: 'success' })
  await loadAddresses()
}

const modalTitle = computed(() =>
  editingId.value ? t('account.addressModalEdit') : t('account.addressModalAdd'),
)
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
    <div class="mb-10">
      <p class="text-xs font-medium tracking-widest text-fuchsia-600 uppercase dark:text-fuchsia-400">
        {{ t('account.eyebrow') }}
      </p>
      <h1 class="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {{ t('account.manageTitle') }}
      </h1>
      <p class="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {{ t('account.manageSubtitle') }}
      </p>
    </div>

    <div class="flex flex-col gap-8">
      <!-- Profile & security -->
      <section class="clay-card px-5 py-6 sm:px-8 sm:py-8">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
          {{ t('account.sectionProfile') }}
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ t('account.passwordOptionalHint') }}
        </p>

        <form class="mt-6 flex flex-col gap-5" @submit.prevent="onSaveProfile">
          <div class="clay-panel-ref2 space-y-4 p-4 sm:p-5">
            <UFormField :label="t('login.emailLabel')" name="email">
              <UInput :model-value="user?.email ?? ''" disabled class="w-full opacity-80" />
            </UFormField>
            <p class="-mt-2 text-xs text-slate-500 dark:text-slate-400">
              {{ t('account.emailHint') }}
            </p>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField :label="t('signup.firstNameLabel')" name="firstName" required>
                <UInput v-model="firstName" autocomplete="given-name" class="w-full" />
              </UFormField>
              <UFormField :label="t('signup.lastNameLabel')" name="lastName" required>
                <UInput v-model="lastName" autocomplete="family-name" class="w-full" />
              </UFormField>
            </div>
            <UFormField :label="t('account.phoneLabel')" name="phone">
              <UInput v-model="phone" type="tel" autocomplete="tel" class="w-full" />
            </UFormField>
          </div>

          <div class="clay-panel-ref2 space-y-4 p-4 sm:p-5">
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {{ t('account.passwordSection') }}
            </h3>
            <UFormField :label="t('account.currentPassword')" name="current">
              <UInput
                v-model="currentPassword"
                :type="showCurrent ? 'text' : 'password'"
                autocomplete="current-password"
                class="w-full"
                icon="i-lucide-lock"
                :placeholder="t('account.currentPassword')"
              >
                <template #trailing>
                  <UButton
                    type="button"
                    color="neutral"
                    variant="ghost"
                    square
                    size="sm"
                    class="-me-1"
                    :icon="showCurrent ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="showCurrent ? t('login.hidePassword') : t('login.showPassword')"
                    @click.prevent="showCurrent = !showCurrent"
                  />
                </template>
              </UInput>
            </UFormField>
            <UFormField :label="t('account.newPassword')" name="newPassword">
              <UInput
                v-model="newPassword"
                :type="showNew ? 'text' : 'password'"
                autocomplete="new-password"
                class="w-full"
                icon="i-lucide-key-round"
                :placeholder="t('account.newPassword')"
              >
                <template #trailing>
                  <UButton
                    type="button"
                    color="neutral"
                    variant="ghost"
                    square
                    size="sm"
                    class="-me-1"
                    :icon="showNew ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="showNew ? t('login.hidePassword') : t('login.showPassword')"
                    @click.prevent="showNew = !showNew"
                  />
                </template>
              </UInput>
            </UFormField>
            <UFormField :label="t('account.confirmPassword')" name="confirmPassword">
              <UInput
                v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                autocomplete="new-password"
                class="w-full"
                icon="i-lucide-lock-keyhole"
                :placeholder="t('account.confirmPassword')"
              >
                <template #trailing>
                  <UButton
                    type="button"
                    color="neutral"
                    variant="ghost"
                    square
                    size="sm"
                    class="-me-1"
                    :icon="showConfirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="showConfirm ? t('login.hidePassword') : t('login.showPassword')"
                    @click.prevent="showConfirm = !showConfirm"
                  />
                </template>
              </UInput>
            </UFormField>
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton type="submit" color="primary" :loading="savingProfile" class="rounded-full px-6 font-semibold">
              {{ t('account.saveProfile') }}
            </UButton>
            <UButton to="/" color="neutral" variant="ghost" class="rounded-full">
              {{ t('account.backHome') }}
            </UButton>
          </div>
        </form>
      </section>

      <!-- Shipping addresses -->
      <section class="clay-card px-5 py-6 sm:px-8 sm:py-8">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            {{ t('account.sectionAddresses') }}
          </h2>
          <UButton color="primary" icon="i-lucide-plus" class="rounded-full font-semibold" @click="openNewAddress">
            {{ t('account.addressAdd') }}
          </UButton>
        </div>

        <div class="mt-6">
          <USkeleton v-if="addressesLoading" class="h-24 w-full rounded-2xl" />
          <p
            v-else-if="addresses.length === 0"
            class="rounded-2xl border border-dashed border-slate-300/80 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400"
          >
            {{ t('account.addressEmpty') }}
          </p>
          <ul v-else class="flex flex-col gap-3">
            <li
              v-for="a in addresses"
              :key="a.id"
              class="clay-panel-ref2 flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5"
            >
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-semibold text-slate-900 dark:text-white">{{ a.recipientName }}</span>
                  <UBadge v-if="a.isDefault" color="primary" variant="subtle" size="xs" class="rounded-full">
                    {{ t('account.addressDefault') }}
                  </UBadge>
                  <UBadge v-if="a.label" color="neutral" variant="outline" size="xs" class="rounded-full">
                    {{ a.label }}
                  </UBadge>
                </div>
                <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {{ a.line1 }}<span v-if="a.line2">, {{ a.line2 }}</span><br>
                  {{ a.city }}<span v-if="a.stateRegion">, {{ a.stateRegion }}</span> {{ a.postalCode }}<br>
                  {{ a.country }}
                </p>
              </div>
              <div class="flex shrink-0 flex-wrap gap-2">
                <UButton size="sm" color="neutral" variant="outline" class="rounded-full" @click="openEditAddress(a)">
                  {{ t('account.addressEdit') }}
                </UButton>
                <UButton size="sm" color="error" variant="soft" class="rounded-full" @click="onDeleteAddress(a.id)">
                  {{ t('account.addressDelete') }}
                </UButton>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <UModal v-model:open="addressOpen" :title="modalTitle">
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField :label="t('account.addressRecipient')" required>
            <UInput v-model="addrRecipient" class="w-full" />
          </UFormField>
          <UFormField :label="t('account.addressLabel')">
            <UInput v-model="addrLabel" class="w-full" />
          </UFormField>
          <UFormField :label="t('account.addressLine1')" required>
            <UInput v-model="addrLine1" class="w-full" />
          </UFormField>
          <UFormField :label="t('account.addressLine2')">
            <UInput v-model="addrLine2" class="w-full" />
          </UFormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField :label="t('account.addressCity')" required>
              <UInput v-model="addrCity" class="w-full" />
            </UFormField>
            <UFormField :label="t('account.addressState')">
              <UInput v-model="addrState" class="w-full" />
            </UFormField>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField :label="t('account.addressPostal')" required>
              <UInput v-model="addrPostal" class="w-full" />
            </UFormField>
            <UFormField :label="t('account.addressCountry')" required>
              <UInput v-model="addrCountry" maxlength="2" class="w-full uppercase" />
            </UFormField>
            <p class="-mt-2 text-xs text-slate-500 dark:text-slate-400">
              {{ t('account.addressCountryHint') }}
            </p>
          </div>
          <UCheckbox v-model="addrIsDefault" :label="t('account.addressDefault')" />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" class="rounded-full" @click="addressOpen = false">
            {{ t('account.modalCancel') }}
          </UButton>
          <UButton color="primary" class="rounded-full font-semibold" :loading="addressSaving" @click="onSaveAddress">
            {{ t('account.addressSave') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
