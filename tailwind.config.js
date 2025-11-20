/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        income: '#34D399',   // Green for income
        expense: '#EF4444',  // Red for expenses
        primary: '#3B82F6',  // Blue for primary actions
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable base styles for mini-program compatibility
  },
}
