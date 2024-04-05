/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      'xs': '480px', 'sm': '640px', 'md': '768px',
      'lg': '1024px', 'xl': '1280px', '2xl': '1536px', '3xl': '1920px',
    },
    extend: {
      colors: {
        nethero: {
          red: '#E50914', redDark: '#B81D24', redHover: '#F40612',
          black: '#000000', bg: '#141414', bgLight: '#181818',
          bgHover: '#2F2F2F', gray: '#808080', grayLight: '#B3B3B3',
          grayDark: '#333333', white: '#FFFFFF', border: '#404040',
          success: '#46D369', warning: '#E87C03',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      fontSize: {
        'hero': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'h1':   ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h2':   ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', fontWeight: '600' }],
        'h3':   ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'row-title': ['clamp(1rem, 1.4vw, 1.4rem)', { lineHeight: '1.3', fontWeight: '600' }],
      },
      spacing: { '4.5': '1.125rem', '18': '4.5rem', '22': '5.5rem', '120': '30rem' },
      boxShadow: {
        'card': '0 6px 20px rgba(0,0,0,0.5)',
        'card-hover': '0 10px 40px rgba(0,0,0,0.75)',
        'modal': '0 25px 60px rgba(0,0,0,0.85)',
        'navbar': '0 4px 6px rgba(0,0,0,0.3)',
      },
      borderRadius: { 'card': '4px', 'modal': '8px', 'pill': '9999px' },
      zIndex: {
        'base': '1', 'card': '10', 'card-hover': '20',
        'navbar': '50', 'dropdown': '60', 'modal': '100', 'toast': '200',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
