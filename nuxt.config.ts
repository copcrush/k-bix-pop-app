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
  // Public keys are overridden at runtime by NUXT_PUBLIC_* env vars on Vercel.
  // Default targets local API on port 8888; override via NUXT_PUBLIC_API_BASE.
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE,
    },
  },
})
