import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f2',
          100: '#e6ede3',
          200: '#cddcc8',
          300: '#a8c29f',
          400: '#82a878',
          500: '#638c59',
          600: '#4d7045',
        },
        blush: {
          50: '#fdf5f6',
          100: '#fce8eb',
          200: '#f9d4da',
          300: '#f4b4bf',
          400: '#ec8a9b',
          500: '#e06478',
        },
        cream: {
          50: '#fefcf8',
          100: '#fdf8f0',
          200: '#f9f0dc',
        },
        henna: {
          500: '#8B4513',
          600: '#6B3410',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config
