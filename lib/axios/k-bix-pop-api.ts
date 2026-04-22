import { useNuxtApp } from '#app'
import axios, { type AxiosError, type AxiosInstance } from 'axios'

export const KBIX_ACCESS_TOKEN_KEY = 'kbix_access_token'

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Device: 'website(1.0)',
} as const

/** Minimal shape for `useCookie` so the axios helper stays decoupled from Nuxt types. */
export type KbixAccessTokenCookie = {
  readonly value: string | null | undefined
}

export interface KbixNuxtProvidedApi {
  public: AxiosInstance
  auth: AxiosInstance
}

export function createKbixPopApiClients(options: {
  baseURL: string
  accessTokenCookie: KbixAccessTokenCookie
  onUnauthorized?: () => void | Promise<void>
}): { publicApi: AxiosInstance; authApi: AxiosInstance } {
  const baseURL = options.baseURL.trim().replace(/\/$/, '')
  const { accessTokenCookie, onUnauthorized } = options

  const publicApi = axios.create({
    baseURL,
    withCredentials: true,
    headers: { ...DEFAULT_HEADERS },
  })

  const authApi = axios.create({
    baseURL,
    withCredentials: true,
    headers: { ...DEFAULT_HEADERS },
  })

  authApi.interceptors.request.use((config) => {
    const token = accessTokenCookie.value
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    return config
  })

  authApi.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      if (error.response?.status === 401)
        await onUnauthorized?.()
      return Promise.reject(error)
    },
  )

  return { publicApi, authApi }
}

export function getKbixApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    if (data?.message && typeof data.message === 'string')
      return data.message
    if (error.message)
      return error.message
  }
  if (error instanceof Error && error.message)
    return error.message
  return fallback
}

function getNuxtApiClients(): KbixNuxtProvidedApi {
  const api = useNuxtApp().$api as KbixNuxtProvidedApi | undefined
  if (!api?.auth || !api?.public) {
    throw new Error(
      'K-Bix API clients are not registered. Ensure the kbix-api Nuxt plugin is loaded.',
    )
  }
  return api
}

export function getKbixPopApiClient(): AxiosInstance {
  return getNuxtApiClients().auth
}

export function getKbixPopPublicApiClient(): AxiosInstance {
  return getNuxtApiClients().public
}

export function getKbixAccessTokenCookieOptions() {
  return {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax' as const,
    secure: !import.meta.dev,
  }
}
