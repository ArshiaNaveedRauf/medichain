/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F3',
        sage: '#A8D5BA',
        'sage-dark': '#7DBFA0',
        pink: '#F4C2C2',
        'text-main': '#3D3D3D',
        muted: '#8A8A8A',
        border: '#EDE7E1',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px 0 rgba(0,0,0,0.06)',
        card: '0 4px 24px 0 rgba(0,0,0,0.07)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-up': 'slideUp 0.4s ease-out both',
        'float': 'float 3s ease-in-out infinite',
        'teardrop': 'teardrop 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        teardrop: {
          '0%, 60%, 100%': { opacity: '0', transform: 'translateY(0px)' },
          '80%': { opacity: '1', transform: 'translateY(8px)' },
        },
      },
    },
  },
  plugins: [],
}
