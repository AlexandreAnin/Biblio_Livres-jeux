import type { Config } from 'tailwindcss'
 
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Thème médiéval/fantasy
        primary: {
          DEFAULT: '#8b6914',
          dark: '#5a4a0a',
          light: '#d4af37',
        },
        background: {
          DEFAULT: '#1a1410',
          light: '#2a1810',
        },
        text: {
          DEFAULT: '#f0e68c',
          muted: '#b8a678',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
 
export default config