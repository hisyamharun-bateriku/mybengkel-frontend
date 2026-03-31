import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#14B8A6',
          hover: '#0F9D8A',
        },
        sidebar: {
          bg: '#2D2D2D',
          active: '#14B8A6',
        },
      },
      width: {
        sidebar: '232px',
      },
      height: {
        topbar: '64px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
