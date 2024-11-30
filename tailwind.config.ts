// tailwind.config.js

import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class', // Enable dark mode support
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Adjusted to cover all src directories
  ],
  theme: {
    extend: {
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
          '6px 6px 12px rgba(255, 102, 0, 0.2), -6px -6px 12px rgba(255, 102, 0, 0.5)',
        'neumorphic-icon-dark':
          '6px 6px 12px rgba(255, 102, 0, 0.5), -6px -6px 12px rgba(255, 102, 0, 0.2)',
      },
      colors: {
        primary: '#FF6600', // Bright orange color
        secondary: '#FFFFFF', // White
        foreground: '#000000', // Black text
        'foreground-dark': '#FFFFFF', // White text in dark mode
        background: '#e0e5ec', // Light grey background
        backgroundDark: '#1A1A1A',
        'background-dark': '#1A1A1A', // Dark background
      },
      borderRadius: {
        xl: '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
