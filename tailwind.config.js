/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
    './content/**/*.{md,yml,json}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter var"', 'Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
