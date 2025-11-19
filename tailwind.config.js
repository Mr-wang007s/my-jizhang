/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          black: '#000000',
          white: '#FFFFFF',
          gray: '#808080',
        },
        neon: {
          yellow: '#FFE500',
          green: '#00FF00',
          blue: '#00D9FF',
          pink: '#FF00FF',
        },
        expense: '#FF0000',
        income: '#00FF00',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['IBM Plex Sans', 'sans-serif'],
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
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      boxShadow: {
        'brutal': '6px 6px 0 #000000',
        'brutal-sm': '4px 4px 0 #000000',
        'brutal-lg': '8px 8px 0 #000000',
        'brutal-neon': '6px 6px 0 #FFE500',
        'brutal-green': '6px 6px 0 #00FF00',
        'brutal-red': '6px 6px 0 #FF0000',
      },
      animation: {
        'glitch': 'glitch 3s infinite',
        'scanline': 'scanline 8s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'slide-up': 'slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-left': 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      transitionTimingFunction: {
        'brutal': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
