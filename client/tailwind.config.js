/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fde5c0',
          200: '#fbc87a',
          300: '#f9a83a',
          400: '#f59015',
          500: '#e67709',
          600: '#c45a06',
          700: '#9e400a',
          800: '#813410',
          900: '#6d2c10',
        },
        dark: {
          900: '#0a0a0a',
          800: '#141414',
          700: '#1f1f1f',
          600: '#2a2a2a',
          500: '#3a3a3a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
