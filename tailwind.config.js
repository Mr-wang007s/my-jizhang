/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        },
        income: {
          light: '#10b981',
          DEFAULT: '#059669',
          dark: '#047857'
        },
        expense: {
          light: '#ef4444',
          DEFAULT: '#dc2626',
          dark: '#b91c1c'
        }
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem'
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
