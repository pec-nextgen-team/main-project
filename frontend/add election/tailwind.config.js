/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0f1f3d',
          950: '#0a1730',
          900: '#0f1f3d',
          800: '#152a52',
          700: '#1c3566',
        },
        brand: {
          blue: '#2563eb',
          red: '#dc2626',
          green: '#16a34a',
          orange: '#f97316',
          purple: '#9333ea',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 31, 61, 0.08), 0 1px 2px -1px rgba(15, 31, 61, 0.06)',
      }
    },
  },
  plugins: [],
}
