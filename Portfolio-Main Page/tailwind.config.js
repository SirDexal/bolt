/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f0ff',
          100: '#e5e5ff',
          200: '#d8b4fe',
          300: '#c084fc',
          400: '#a855f7',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f0f0f',
          950: '#000000',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typing': 'typing 3.5s steps(40, end), blink-caret .75s step-end infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'gradient': 'gradient 8s linear infinite',
        'glitch': 'glitch 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 5px #8b5cf6, 0 0 10px #8b5cf6, 0 0 15px #8b5cf6',
          },
          '100%': { 
            boxShadow: '0 0 10px #c084fc, 0 0 20px #c084fc, 0 0 30px #c084fc',
          },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#8b5cf6' }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        glitch: {
          '0%': {
            transform: 'translate(0)',
            filter: 'hue-rotate(0deg)'
          },
          '20%': {
            transform: 'translate(-2px, 2px)',
            filter: 'hue-rotate(90deg)'
          },
          '40%': {
            transform: 'translate(-2px, -2px)',
            filter: 'hue-rotate(180deg)'
          },
          '60%': {
            transform: 'translate(2px, 2px)',
            filter: 'hue-rotate(270deg)'
          },
          '80%': {
            transform: 'translate(2px, -2px)',
            filter: 'hue-rotate(360deg)'
          },
          '100%': {
            transform: 'translate(0)',
            filter: 'hue-rotate(0deg)'
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0'
          },
          '100%': {
            backgroundPosition: '200% 0'
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};