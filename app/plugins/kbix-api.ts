import {
  createKbixPopApiClients,
  KBIX_ACCESS_TOKEN_KEY,
  getKbixAccessTokenCookieOptions,
} from '~~/lib/axios/k-bix-pop-api'
import { useAuth } from '../composables/useAuth'

export default defineNuxtPlugin({
  name: 'kbix-api',
  enforce: 'pre',
  setup() {
    const apiBase = useRuntimeConfig().public.apiBase
    const baseURL =
      typeof apiBase === 'string' && apiBase.trim() !== ''
        ? apiBase.trim().replace(/\/$/, '')
        : 'http://localhost:8888/api'

    const accessToken = useCookie(KBIX_ACCESS_TOKEN_KEY, getKbixAccessTokenCookieOptions())

    const { publicApi, authApi } = createKbixPopApiClients({
      baseURL,
      accessTokenCookie: accessToken,
      onUnauthorized: async () => {
        if (!import.meta.client)
          return
        useAuth().clear()
        const route = useRoute()
        if (route.path === '/login' || route.path === '/register')
          return
        await navigateTo('/login', { replace: true })
      },
    })

    return {
      provide: {
        api: {
          public: publicApi,
          auth: authApi,
        },
      },
    }
  },
})
