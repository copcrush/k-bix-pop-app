import { setKbixPopApiRuntimeBaseURL } from '~~/lib/axios/k-bix-pop-api'

export default defineNuxtPlugin({
  name: 'kbix-api-runtime-config',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig()
    setKbixPopApiRuntimeBaseURL(String(config.public.apiBase))
  },
})
