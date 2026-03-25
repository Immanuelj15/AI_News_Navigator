/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bloomberg: {
          black: '#000000',
          dark: '#0a0a0a',
          card: '#111111',
          border: '#333333',
          neon: '#00ff41', // Matrix/Neon green for accents
          blue: '#1e3a8a',
          gray: '#888888',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
