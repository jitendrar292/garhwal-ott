/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary: Warm gold/saffron — culturally resonant for Pahadi identity
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Secondary: Teal/cyan — for interactive elements & links
        secondary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Accent: Rose — for highlights, music, notifications
        accent: {
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        // Surface: Elevation system (progressively lighter)
        surface: {
          0: '#0a0a12',    // Deepest background
          1: '#12121e',    // Page background
          2: '#1a1a2e',    // Card background
          3: '#22223a',    // Elevated card/hover
          4: '#2a2a46',    // Popover/dropdown
          5: '#363652',    // Active/selected
        },
        // Dark palette — backwards compatibility alias
        dark: {
          950: '#0a0a12',
          900: '#12121e',
          800: '#1a1a2e',
          700: '#22223a',
          600: '#2a2a46',
          500: '#363652',
          400: '#4a4a6a',
        },
        // Content-type accent colors
        content: {
          cultural: '#f59e0b',   // Amber — cultural/folk
          jobs: '#10b981',       // Emerald — jobs/govt
          learning: '#3b82f6',   // Blue — education
          music: '#ec4899',      // Pink — music
          stories: '#a78bfa',    // Purple — folk stories
          news: '#14b8a6',       // Teal — news/updates
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '700' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        'section-sm': '2rem',
        'section-md': '3rem',
        'section-lg': '4rem',
      },
      maxWidth: {
        'container-narrow': '720px',
        'container-default': '1280px',
        'container-wide': '1440px',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(245, 158, 11, 0.12)',
        'glow': '0 0 20px rgba(245, 158, 11, 0.15)',
        'glow-lg': '0 0 40px rgba(245, 158, 11, 0.2)',
        'glow-secondary': '0 0 20px rgba(6, 182, 212, 0.15)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
        'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.4)',
        'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.35), 0 6px 6px rgba(0, 0, 0, 0.4)',
        'elevation-4': '0 20px 40px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 50%), radial-gradient(at 80% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 50%)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-smooth': 'cubic-bezier(0.45, 0, 0.55, 1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      },
      keyframes: {
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
