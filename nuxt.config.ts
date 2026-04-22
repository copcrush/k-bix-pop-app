// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxt/ui'],
  icon: {
    serverBundle: {
      collections: ['circle-flags', 'lucide'],
    },
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
      ],
    },
  },
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      include: ['axios'],
    },
  },
  // Public keys are overridden at runtime by NUXT_PUBLIC_* on the host (e.g. Vercel).
  // .env is not deployed — set NUXT_PUBLIC_API_BASE in Vercel → Settings → Environment Variables,
  // or rely on the production default below when the var is unset at build time.
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE
        || (process.env.NODE_ENV === 'development'
          ? 'http://localhost:8888/api'
          : 'https://k-bix-pop-api.vercel.app/api'),
    },
  },
})
