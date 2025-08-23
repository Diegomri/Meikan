/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
        'display': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'meikan-teal': {
          DEFAULT: '#00796B', // El color principal
          dark: '#00695C',   // Un tono más oscuro para hover/focus
        },
        'meikan-charcoal': '#374151',
      }
    },
  },
  plugins: [],
}