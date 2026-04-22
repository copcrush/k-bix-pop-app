import type { AuthUser, LoginResponse, RefreshResponse, RegisterResponse } from '~/types/auth'
import {
  getKbixAccessTokenCookieOptions,
  getKbixPopApiClient,
  getKbixPopPublicApiClient,
  getKbixApiErrorMessage,
  KBIX_ACCESS_TOKEN_KEY,
} from '~~/lib/axios/k-bix-pop-api'

const USER_KEY = 'kbix_user'
const TOKEN_KEY = KBIX_ACCESS_TOKEN_KEY

export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const accessToken = useState<string | null>('auth-token', () => null)
  const pending = useState('auth-pending', () => false)

  const isLoggedIn = computed(() => !!user.value && !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const roleLabelKey = computed(() =>
    user.value?.role === 'ADMIN' ? 'nav.roleAdmin' : 'nav.roleCustomer',
  )

  function tokenCookie() {
    return useCookie(TOKEN_KEY, getKbixAccessTokenCookieOptions())
  }

  function persist() {
    if (!import.meta.client) return
    if (user.value && accessToken.value) {
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
      tokenCookie().value = accessToken.value
      localStorage.removeItem(TOKEN_KEY)
    }
    else {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      tokenCookie().value = null
    }
  }

  function hydrate() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(USER_KEY)
      let tok = tokenCookie().value ?? null
      if (!tok) {
        const legacy = localStorage.getItem(TOKEN_KEY)
        if (legacy) {
          tok = legacy
          tokenCookie().value = legacy
          localStorage.removeItem(TOKEN_KEY)
        }
      }
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
      const { data: res } = await getKbixPopPublicApiClient().post<LoginResponse>(
        '/auth/login',
        { email, password },
      )
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
      await getKbixPopPublicApiClient().post<RegisterResponse>('/auth/register', payload)
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
    const { data: res } = await getKbixPopPublicApiClient().post<RefreshResponse>('/auth/refresh')
    accessToken.value = res.accessToken
    persist()
    return res
  }

  async function refreshUser() {
    try {
      const { data } = await getKbixPopApiClient().get<AuthUser>('/users/me')
      user.value = data
      persist()
      return { ok: true as const }
    }
    catch (e: unknown) {
      return {
        ok: false as const,
        message: getKbixApiErrorMessage(e, 'Could not load profile'),
      }
    }
  }

  async function updateManageUser(payload: {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    currentPassword?: string
    newPassword?: string
  }) {
    try {
      const { data } = await getKbixPopApiClient().patch<AuthUser>('/users/me', payload)
      user.value = data
      persist()
      return { ok: true as const }
    }
    catch (e: unknown) {
      return {
        ok: false as const,
        message: getKbixApiErrorMessage(e, 'Could not save changes'),
      }
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    try {
      await getKbixPopApiClient().post('/users/me/password', {
        currentPassword,
        newPassword,
      })
      return { ok: true as const }
    }
    catch (e: unknown) {
      return {
        ok: false as const,
        message: getKbixApiErrorMessage(e, 'Could not change password'),
      }
    }
  }

  async function logout() {
    const tok = accessToken.value
    if (tok) {
      try {
        await getKbixPopApiClient().post('/auth/logout')
      }
      catch {
        /* still clear client */
      }
    }
    clear()
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

  /**
   * Plain refs + computeds (not wrapped in reactive()).
   * Nesting computed refs inside reactive() can break template updates for `isLoggedIn`
   * while `user` still renders — e.g. guest Register + logged-in menu at once.
   */
  return {
    user,
    accessToken,
    pending,
    isLoggedIn,
    isAdmin,
    roleLabelKey,
    hydrate,
    login,
    register,
    refreshUser,
    updateManageUser,
    changePassword,
    logout,
    refreshAccessToken,
    displayName,
    initials,
  }
}
