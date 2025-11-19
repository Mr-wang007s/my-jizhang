/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ios-blue': '#007AFF',
        'ios-green': '#34C759',
        'ios-red': '#FF3B30',
        'ios-orange': '#FF9500',
        'ios-purple': '#AF52DE',
        expense: '#FF3B30',
        income: '#34C759',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['20px', '24px'],
        sm: ['24px', '28px'],
        base: ['28px', '34px'],
        lg: ['32px', '38px'],
        xl: ['36px', '42px'],
        '2xl': ['42px', '48px'],
        '3xl': ['52px', '58px'],
        '4xl': ['64px', '72px'],
        '5xl': ['80px', '88px'],
        '6xl': ['96px', '104px'],
      },
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'ios': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'ios-lg': '0 20px 50px rgba(0, 0, 0, 0.15)',
        'ios-xl': '0 30px 60px rgba(0, 0, 0, 0.2)',
        'card': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'floating': '0 10px 30px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'fade-slide-up': 'fadeSlideUp 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) both',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) both',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeSlideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          'from': { transform: 'translateY(100%)' },
          'to': { transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
