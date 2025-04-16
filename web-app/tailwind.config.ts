
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
        // Custom colors for Seth Sri Shipping
        sethsri: {
          red: '#CC0000',
          gray: '#475569',
          blue: '#0C4DA2',
          darkgray: '#323e4c'
        },
        navy: {
          50: '#e6ebf2',
          100: '#ccd7e5',
          200: '#99aecb',
          300: '#6686b1',
          400: '#335d97',
          500: '#475569', // Updated to Seth Sri gray
          600: '#323e4c',
          700: '#263037',
          800: '#192024',
          900: '#0c1012',
        },
        accent: {
          50: '#eaf2f8',
          100: '#d5e6f1',
          200: '#abcce3',
          300: '#82b3d5',
          400: '#5899c7',
          500: '#0C4DA2', // Seth Sri blue
          600: '#0a3d82',
          700: '#072e61',
          800: '#051e41',
          900: '#020f20',
        },
        gray: {
          50: '#F5F7FA', // Light background
          100: '#e6e8ed',
          200: '#cdd1dc',
          300: '#b4b9ca',
          400: '#9ba2b9',
          500: '#828aa7',
          600: '#686f86',
          700: '#4e5364',
          800: '#343843',
          900: '#1a1c21',
        },
        success: {
          50: '#e6f5ed',
          100: '#ccebdb',
          200: '#99d7b7',
          300: '#66c393',
          400: '#33af6f',
          500: '#009b4b',
          600: '#007c3c',
          700: '#005d2d',
          800: '#003e1e',
          900: '#001f0f',
        },
        warning: {
          50: '#fef9e6',
          100: '#fdf3cc',
          200: '#fbe799',
          300: '#f9db66',
          400: '#f8cf33',
          500: '#f6c300',
          600: '#c59c00',
          700: '#947500',
          800: '#624e00',
          900: '#312700',
        },
        danger: {
          50: '#fceaea',
          100: '#f9d5d5',
          200: '#f4abab',
          300: '#ee8080',
          400: '#e95656',
          500: '#CC0000', // Seth Sri red
          600: '#a30000',
          700: '#7a0000',
          800: '#520000',
          900: '#290000',
        },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
