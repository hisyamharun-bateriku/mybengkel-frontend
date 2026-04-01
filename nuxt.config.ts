export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: { compatibilityVersion: 4 },
  devServer: { port: 3001 },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  routeRules: {
    '/':                  { redirect: '/login' },
    '/login':             { auth: 'guest' },
    '/forgot-password':   { auth: 'guest' },
    '/reset-password':    { auth: 'guest' },
    '/setup-password/**': { auth: false },
    '/panel/**':          { auth: 'user' },
    '/partner/**':        { auth: 'user' },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:3000',
    },
  },

  components: [
    { path: '~/components', pathPrefix: false, extensions: ['.vue'] },
  ],

  css: ['~/assets/css/main.css'],

})
