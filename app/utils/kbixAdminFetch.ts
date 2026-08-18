import {
  getKbixAccessTokenCookieOptions,
  KBIX_ACCESS_TOKEN_KEY,
} from '~~/lib/axios/k-bix-pop-api'

export function getKbixAdminAuthHeaders(): Record<string, string> {
  const { accessToken } = useAuth()
  const token
    = accessToken.value
      || useCookie(KBIX_ACCESS_TOKEN_KEY, getKbixAccessTokenCookieOptions()).value
      || null

  return token ? { Authorization: `Bearer ${token}` } : {}
}
