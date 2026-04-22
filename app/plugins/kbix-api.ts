import {
  createKbixPopApiClients,
  KBIX_ACCESS_TOKEN_KEY,
  getKbixAccessTokenCookieOptions,
  resolveKbixApiBase,
} from '~~/lib/axios/k-bix-pop-api'

export default defineNuxtPlugin({
  name: 'kbix-api',
  enforce: 'pre',
  setup() {
    const runtimeConfig = useRuntimeConfig()
    const baseURL = resolveKbixApiBase(
      typeof runtimeConfig.public.apiBase === 'string'
        ? runtimeConfig.public.apiBase
        : undefined,
    )

    const accessToken = useCookie(KBIX_ACCESS_TOKEN_KEY, getKbixAccessTokenCookieOptions())

    const { publicApi, authApi } = createKbixPopApiClients({
      baseURL,
      getAccessToken: () => accessToken.value ?? undefined,
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
