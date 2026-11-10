import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: false,
  runtimeConfig: {
    public: {
      siteUrl: '',
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'id',
      },
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-eth.png',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  }
})
