import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  extends: ['@eth/ui'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: false,
  ssr: false,
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
