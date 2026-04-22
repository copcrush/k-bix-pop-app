import { useNuxtApp } from '#app'
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'

export const KBIX_ACCESS_TOKEN_KEY = 'kbix_access_token'

/** @deprecated Use {@link KBIX_ACCESS_TOKEN_KEY} — kept for existing imports */
export const KBIX_ACCESS_TOKEN_STORAGE_KEY = KBIX_ACCESS_TOKEN_KEY

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Device: 'website(1.0)',
} as const

export interface CreateKbixPopApiClientsOptions {
  baseURL: string
  getAccessToken?: () => string | null | undefined
  onUnauthorized?: () => void | Promise<void>
}

export interface KbixPopApiClients {
  publicApi: AxiosInstance
  authApi: AxiosInstance
}

export interface KbixNuxtProvidedApi {
  public: AxiosInstance
  auth: AxiosInstance
}

export function resolveKbixApiBase(configured: string): string {
  const trimmed = configured?.trim()
  if (trimmed)
    return trimmed.replace(/\/$/, '')
  if (import.meta.dev)
    return 'http://localhost:8888/api'
  return 'http://localhost:8888/api'
}

function isAuthBootstrapUnauthorized(config?: InternalAxiosRequestConfig): boolean {
  const url = config?.url ?? ''
  return (
    url.includes('/auth/login')
    || url.includes('/auth/register')
    || url.includes('/auth/forgot-password')
    || url.includes('/auth/reset-password')
  )
}

export function createKbixPopApiClients(
  options: CreateKbixPopApiClientsOptions,
): KbixPopApiClients {
  const { baseURL, getAccessToken, onUnauthorized } = options

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
    const token = getAccessToken?.()
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    return config
  })

  authApi.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      if (error.response?.status === 401 && !isAuthBootstrapUnauthorized(error.config)) {
        try {
          await onUnauthorized?.()
        }
        catch {
          return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  })

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
  const nuxtApp = useNuxtApp()
  const api = nuxtApp.$api as KbixNuxtProvidedApi | undefined
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
