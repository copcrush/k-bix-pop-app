/**
 * k-bix-pop REST HTTP client (Axios).
 *
 * Naming (common in production apps):
 * - `baseURL` — Axios option (camelCase); public env: `NUXT_PUBLIC_API_BASE`
 * - `createKbixPopApiClient` — factory when you need a dedicated instance (tests, scripts)
 * - `getKbixPopApiClient` — lazy singleton for the browser / SSR bundle (same as many codebases’ `apiClient`)
 * - `getApiClient` — alias of `getKbixPopApiClient` (familiar name from other projects)
 */
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

/** Must stay in sync with `useAuth` localStorage key */
export const KBIX_ACCESS_TOKEN_STORAGE_KEY = 'kbix_access_token'

export type CreateKbixPopApiClientOptions = {
  /** API root including `/api` prefix, e.g. `http://localhost:8888/api` */
  baseURL: string
  /** Send cookies (refresh token on API host). Default: true */
  withCredentials?: boolean
  /** Override how the Bearer token is read (default: localStorage on client) */
  getAccessToken?: () => string | null
}

export function normalizeBaseURL(url: string): string {
  return url.replace(/\/+$/, '')
}

/**
 * Resolves public API base URL without calling Nuxt composables
 * (safe from plain `lib` imports during build).
 */
export function resolvePublicApiBaseURL(): string {
  const raw = import.meta.env.NUXT_PUBLIC_API_BASE
  if (typeof raw === 'string' && raw.trim().length > 0)
    return normalizeBaseURL(raw.trim())
  return normalizeBaseURL('http://localhost:8888/api')
}

function defaultGetAccessToken(): string | null {
  if (typeof localStorage === 'undefined')
    return null
  return localStorage.getItem(KBIX_ACCESS_TOKEN_STORAGE_KEY)
}

export function createKbixPopApiClient(options: CreateKbixPopApiClientOptions): AxiosInstance {
  const baseURL = normalizeBaseURL(options.baseURL)
  const withCredentials = options.withCredentials ?? true
  const getToken = options.getAccessToken ?? defaultGetAccessToken

  const client = axios.create({
    baseURL,
    withCredentials,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    validateStatus: (status) => status >= 200 && status < 300,
  })

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return client
}

let singleton: AxiosInstance | null = null
let singletonBaseURL: string | null = null

/**
 * Shared Axios instance for the storefront API (credentials + Bearer from storage).
 * Prefer this over ad-hoc `$fetch` when you need interceptors, timeouts, and upload progress.
 */
export function getKbixPopApiClient(): AxiosInstance {
  const baseURL = resolvePublicApiBaseURL()
  if (!singleton || singletonBaseURL !== baseURL) {
    singleton = createKbixPopApiClient({ baseURL })
    singletonBaseURL = baseURL
  }
  return singleton
}

/** Familiar alias used in many repos (“api client” = typed HTTP singleton) */
export const getApiClient = getKbixPopApiClient

export function isKbixAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

/** Best-effort message from Nest validation or Axios */
export function getKbixApiErrorMessage(error: unknown, fallback = 'Request failed'): string {
  if (!isKbixAxiosError(error))
    return error instanceof Error ? error.message : fallback

  const data = error.response?.data as { message?: string | string[] } | undefined
  const msg = data?.message
  if (Array.isArray(msg))
    return msg.join(', ')
  if (typeof msg === 'string' && msg.length > 0)
    return msg
  if (error.message)
    return error.message
  return fallback
}
