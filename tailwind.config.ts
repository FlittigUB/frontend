import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFDB35', // Lys gul
        secondary: '#FFFFFF', // Myk hvit
        blueGreen: '#20B2AA', // Blågrønn nyanse
        foreground: '#000000', // Svart
        background: '#FFFFFF', // Hvit bakgrunn
      },
    },
  },
  plugins: [],
} satisfies Config;
