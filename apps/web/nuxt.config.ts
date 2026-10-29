import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: false,
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '256x256',
          href: '/favicon-eth-v2.png',
        },
        {
          rel: 'shortcut icon',
          type: 'image/x-icon',
          href: '/favicon.ico?v=2',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  }
})
