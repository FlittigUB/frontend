import type { Config } from "tailwindcss";

export default {
	darkMode: ['class', 'class'], // Changed from ['class', 'class'] to 'class'
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], // Fixed content path
	theme: {
		extend: {
			animation: {
				'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
				'spin-smooth': 'spin-smooth 1.2s linear infinite',
				'draw-path': 'draw 2s ease-out forwards, fill 0.5s ease-out 2.5s forwards',
				overlayIn: "overlayIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
				overlayOut: "overlayOut 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
				dialogIn: "dialogIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
				dialogOut: "dialogOut 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
			},
			keyframes: {
				overlayIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				overlayOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				dialogIn: {
					'0%': { opacity: '0', transform: 'translateY(8px) scale(0.95)' },
					'100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
				},
				dialogOut: {
					'0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
					'100%': { opacity: '0', transform: 'translateY(8px) scale(0.95)' },
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'spin-smooth': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				draw: {
					'0%': {
						strokeDashoffset: '1000'
					},
					'100%': {
						strokeDashoffset: '0'
					}
				},
				fill: {
					'0%': {
						fill: 'transparent'
					},
					'100%': {
						fill: '#ffffff'
					}
				}
			},
			boxShadow: {
				neumorphic: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.7)',
				'neumorphic-dark': '6px 6px 12px rgba(0, 0, 0, 0.5), -6px -6px 12px rgba(255, 255, 255, 0.1)',
				button: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.7)',
				'button-dark': '4px 4px 8px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.1)',
				'neumorphic-icon': '6px 6px 12px rgba(255, 102, 0, 0.2), -6px -6px 12px rgba(255, 255, 53, 0.5)',
				'neumorphic-icon-dark': '6px 6px 12px rgba(255, 102, 0, 0.5), -6px -6px 12px rgba(255, 102, 0, 0.2)'
			},
			colors: {
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				foreground: 'hsl(var(--foreground))',
				foregroundDark: '#FFFFFF',
				background: 'hsl(var(--background))',
				backgroundDark: '#1A1A1A',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			typography: (theme: any) => ({
				DEFAULT: {
					css: {
						color: theme('colors.foreground'),
						a: {
							color: theme('colors.foreground'),
							'&:hover': {
								color: theme('colors.foreground'), // Adjust hover color if needed
							},
						},
						h1: {
							color: theme('colors.foreground'),
						},
						h2: {
							color: theme('colors.foreground'),
						},
						h3: {
							color: theme('colors.foreground'),
						},
						// Add more element-specific styles as needed
					},
				},
			}),
			borderRadius: {
				xl: '1.5rem',
				'3xl': '2rem',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			maxWidth: {
				'900px': '900px'
			},
			backgroundImage: {
				'header-gradient': 'linear-gradient(to bottom, #FFFFFF, #F3F4F6)',
				'background-gradient': 'linear-gradient(to bottom, #FFF8DC, #FFFFFF)'
			}
		}
	},
	plugins: [
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require('@tailwindcss/typography'),
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require("tailwindcss-animate")
	],
} satisfies Config;
