import { setKbixPopApiRuntimeBaseURL } from '~~/lib/axios/k-bix-pop-api'

/**
 * Binds Axios base URL to Nuxt `runtimeConfig.public.apiBase` so the same build
 * picks up Vercel Preview/Production env without relying only on build-time `import.meta.env`.
 */
export default defineNuxtPlugin({
  name: 'kbix-api-runtime-config',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig()
    setKbixPopApiRuntimeBaseURL(String(config.public.apiBase))
  },
})
