import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  extends: ['@eth/ui'],
  modules: ['nuxt-auth-utils'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: false,
  ssr: false,
  runtimeConfig: {
    apiBaseUrl: 'http://localhost:3001',
    cmsOrigin: 'http://localhost:3002',
    session: {
      name: 'eth-cms-session',
      maxAge: 60 * 60 * 24 * 30,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      },
    },
  },
  app: {
    head: {
      title: 'ETH Cargo CMS',
      htmlAttrs: { lang: 'id' },
      meta: [{ name: 'robots', content: 'noindex, nofollow' }],
    },
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
