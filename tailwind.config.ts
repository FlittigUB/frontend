import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class', // Enable dark mode support
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Adjusted to cover all src directories
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'spin-smooth': 'spin-smooth 1.2s linear infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-smooth': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        neumorphic:
          '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.7)',
        'neumorphic-dark':
          '6px 6px 12px rgba(0, 0, 0, 0.5), -6px -6px 12px rgba(255, 255, 255, 0.1)',
        button:
          '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'button-dark':
          '4px 4px 8px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.1)',
        'neumorphic-icon':
          '6px 6px 12px rgba(255, 102, 0, 0.2), -6px -6px 12px rgba(255, 255, 53, 0.5)',
        'neumorphic-icon-dark':
          '6px 6px 12px rgba(255, 102, 0, 0.5), -6px -6px 12px rgba(255, 102, 0, 0.2)',
      },
      colors: {
        primary: '#FFE135', // Bright orange color
        secondary: '#FFFFFF', // White
        foreground: '#000000', // Black text
        foregroundDark: '#FFFFFF', // White text in dark mode
        background: '#FFF8DC', // Light cream background
        backgroundDark: '#1A1A1A', // Dark background
      },
      borderRadius: {
        xl: '1.5rem',
        '3xl': '2rem',
      },
      maxWidth: {
        '900px': '900px',
      },
      backgroundImage: {
        'header-gradient': 'linear-gradient(to bottom, #FFFFFF, #F3F4F6)',
        'background-gradient': 'linear-gradient(to bottom, #FFF8DC, #FFFFFF)',
      },
    },
  },
  plugins: [],
} satisfies Config;
