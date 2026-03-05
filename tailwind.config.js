/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta industrial/mecánica
        primary: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0dae6',
          300: '#a7bbcf',
          400: '#7897b4',
          500: '#2C5F8D', // Azul metálico principal
          600: '#254d73',
          700: '#1f3f5e',
          800: '#1b354e',
          900: '#1a2e42',
        },
        secondary: {
          50: '#fff5f0',
          100: '#ffe8dc',
          200: '#ffd1be',
          300: '#ffb08f',
          400: '#ff8858',
          500: '#FF6B35', // Naranja mecánico
          600: '#f04d14',
          700: '#c73b0c',
          800: '#9e3110',
          900: '#7f2b10',
        },
        warning: {
          50: '#fffbeb',
          100: '#fff4c6',
          200: '#ffe888',
          300: '#ffd84a',
          400: '#FFC300', // Amarillo de advertencia
          500: '#f5a900',
          600: '#d98400',
          700: '#b45d02',
          800: '#924808',
          900: '#783b0b',
        },
        dark: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1a1a1a', // Negro carbón
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'metal': '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.2)',
        'metal-lg': '0 10px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.15)',
        'metal-xl': '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
