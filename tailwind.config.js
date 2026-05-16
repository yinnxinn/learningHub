/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
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
