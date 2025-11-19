/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        success: '#34C759',
        danger: '#FF3B30',
        warning: '#FF9500',
        info: '#5AC8FA',
        expense: '#FF3B30',
        income: '#34C759',
        neutral: '#8E8E93',
        background: '#F5F5F7',
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.8)',
          solid: '#FFFFFF',
        },
        text: {
          primary: '#000000',
          secondary: '#8E8E93',
          tertiary: '#C7C7CC',
          inverse: '#FFFFFF',
        },
        border: 'rgba(60, 60, 67, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.4)',
      },
      spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
      },
      fontSize: {
        xs: '22px',
        sm: '26px',
        md: '30px',
        base: '32px',
        lg: '36px',
        xl: '40px',
        '2xl': '48px',
        '3xl': '56px',
        '4xl': '64px',
        '5xl': '96px',
      },
      height: {
        'button-lg': '56px',
        'button-md': '44px',
        'button-sm': '36px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.04)',
        md: '0 8px 16px rgba(0, 0, 0, 0.06)',
        lg: '0 16px 32px rgba(0, 0, 0, 0.12)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        colored: '0 10px 20px rgba(0, 122, 255, 0.2)',
      },
      transitionDuration: {
        instant: '100ms',
        fast: '200ms',
        normal: '300ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      zIndex: {
        modal: '1000',
        popup: '900',
        fixed: '800',
        tabbar: '700',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)',
        'success-gradient': 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
        'danger-gradient': 'linear-gradient(135deg, #FF3B30 0%, #FF9500 100%)',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles for Taro compatibility
  },
}
