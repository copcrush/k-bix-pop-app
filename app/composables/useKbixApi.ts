import type { AxiosInstance } from 'axios'
import type { KbixNuxtProvidedApi } from '~~/lib/axios/k-bix-pop-api'

export interface UseKbixApiReturn {
  publicApi: AxiosInstance
  authApi: AxiosInstance
}

/**
 * Typed access to Axios clients from the `kbix-api` plugin (`$api.public` / `$api.auth`).
 */
export function useKbixApi(): UseKbixApiReturn {
  const { public: publicApi, auth: authApi } = useNuxtApp().$api as KbixNuxtProvidedApi
  return { publicApi, authApi }
}
