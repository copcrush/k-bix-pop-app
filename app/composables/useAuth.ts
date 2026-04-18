import { reactive } from 'vue'
import type { AuthUser, LoginResponse, RefreshResponse, RegisterResponse } from '~/types/auth'
import {
  getKbixPopApiClient,
  getKbixApiErrorMessage,
  KBIX_ACCESS_TOKEN_STORAGE_KEY,
} from '~~/lib/axios/k-bix-pop-api'

const USER_KEY = 'kbix_user'
const TOKEN_KEY = KBIX_ACCESS_TOKEN_STORAGE_KEY

export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const accessToken = useState<string | null>('auth-token', () => null)
  const pending = useState('auth-pending', () => false)

  const isLoggedIn = computed(() => !!user.value && !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const roleLabelKey = computed(() =>
    user.value?.role === 'ADMIN' ? 'nav.roleAdmin' : 'nav.roleCustomer',
  )

  function persist() {
    if (!import.meta.client) return
    if (user.value && accessToken.value) {
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
      localStorage.setItem(TOKEN_KEY, accessToken.value)
    }
    else {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  function hydrate() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(USER_KEY)
      const tok = localStorage.getItem(TOKEN_KEY)
      if (raw && tok) {
        user.value = JSON.parse(raw) as AuthUser
        accessToken.value = tok
      }
    }
    catch {
      user.value = null
      accessToken.value = null
    }
  }

  function clear() {
    user.value = null
    accessToken.value = null
    persist()
  }

  async function login(email: string, password: string) {
    pending.value = true
    try {
      const { data: res } = await getKbixPopApiClient().post<LoginResponse>('/auth/login', {
        email,
        password,
      })
      user.value = res.user
      accessToken.value = res.accessToken
      persist()
      return { ok: true as const }
    }
    catch (e: unknown) {
      return { ok: false as const, message: getKbixApiErrorMessage(e, 'Login failed') }
    }
    finally {
      pending.value = false
    }
  }

  async function register(payload: {
    email: string
    password: string
    firstName?: string
    lastName?: string
  }) {
    pending.value = true
    try {
      await getKbixPopApiClient().post<RegisterResponse>('/auth/register', payload)
      return { ok: true as const }
    }
    catch (e: unknown) {
      return { ok: false as const, message: getKbixApiErrorMessage(e, 'Registration failed') }
    }
    finally {
      pending.value = false
    }
  }

  async function refreshAccessToken() {
    const { data: res } = await getKbixPopApiClient().post<RefreshResponse>('/auth/refresh')
    accessToken.value = res.accessToken
    persist()
    return res
  }

  async function logout() {
    const tok = accessToken.value
    clear()
    if (!tok) return
    try {
      await getKbixPopApiClient().post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${tok}` },
      })
    }
    catch {
      /* still cleared client */
    }
  }

  function displayName(u: AuthUser | null) {
    if (!u) return ''
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim()
    return name || u.email
  }

  function initials(u: AuthUser | null) {
    if (!u) return '?'
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim()
    if (!name) return (u.email[0] || '?').toUpperCase()
    const parts = name.split(/\s+/)
    if (parts.length >= 2)
      return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  /* reactive() so template `auth.pending` / `auth.isLoggedIn` unwrap Refs & ComputedRefs */
  return reactive({
    user,
    accessToken,
    pending,
    isLoggedIn,
    isAdmin,
    roleLabelKey,
    hydrate,
    login,
    register,
    logout,
    refreshAccessToken,
    displayName,
    initials,
  })
}
