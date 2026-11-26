import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: false,
  runtimeConfig: {
    duckingSigningSecret: '',
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
  hooks: {
    'build:manifest'(manifest) {
      // Let <img> loading rules control downloads instead of prefetching every image.
      for (const resource of Object.values(manifest)) {
        if (resource.resourceType === 'image') {
          resource.prefetch = false
        }
      }
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
