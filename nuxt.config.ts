export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxtjs/tailwindcss',
    '@onmax/nuxt-better-auth',
    '@pinia/nuxt',
  ],

  auth: {
    clientOnly: true,
    redirects: {
      login: '/login',
      guest: '/panel/dashboard',
    },
  },

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

  css: ['~/assets/css/main.css'],

})
