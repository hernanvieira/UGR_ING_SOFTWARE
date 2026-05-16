/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cg-blue': '#4f6ef7',
        'cg-sidebar': '#1e2235',
        'cg-red': '#E24B4A',
        'cg-amber': '#EF9F27',
        'cg-green': '#639922',
        'cg-navy': '#378ADD',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
