/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF4FF',
          100: '#D6E8FF',
          200: '#B3D6FF',
          300: '#80BFFF',
          400: '#4A90E2',
          500: '#4A90E2',
          600: '#3A73B8',
          700: '#2C5690',
          800: '#1E3A68',
          900: '#0F1D34'
        },
        secondary: {
          50: '#F0EFFF',
          100: '#E1DDFF',
          200: '#C9C0FF',
          300: '#A89FFF',
          400: '#8B7FFF',
          500: '#7B68EE',
          600: '#6349E1',
          700: '#4E35B8',
          800: '#382490',
          900: '#1D1368'
        },
        accent: {
          50: '#FFF0F0',
          100: '#FFE1E1',
          200: '#FFC8C8',
          300: '#FFA1A1',
          400: '#FF7A7A',
          500: '#FF6B6B',
          600: '#E54E4E',
          700: '#C73B3B',
          800: '#A82828',
          900: '#751B1B'
        },
        surface: {
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F5F5F5',
          300: '#EEEEEE',
          400: '#E0E0E0'
        },
        background: {
          50: '#F5F7FA',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0'
        }
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}