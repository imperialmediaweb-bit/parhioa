import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: { '2xl': '1280px' },
    },
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Logo-derived palette (UNCHANGED — these are the brand colours)
        burgundy: { DEFAULT: '#81231B', dark: '#651a14', light: '#a02e23' },
        ink: { DEFAULT: '#101840', muted: '#4a5275', soft: '#6f7693' },
        cream: { DEFAULT: '#FBF6EE', card: '#f4ead8', deep: '#ead8b8' },
        gold: { DEFAULT: '#EAC784', light: '#f4dfb3', dark: '#c9a361' },
        lavender: { DEFAULT: '#9b8caa', dark: '#7a6c8c', light: '#bcb0c8', soft: '#ebe5f0' },
        // Aliases for backwards compat
        navy: { DEFAULT: '#101840', dark: '#0a0e2d', soft: '#1c2454' },
        coral: { DEFAULT: '#81231B', dark: '#651a14', light: '#a02e23' },
        border: '#e5dfd7',
        // NEW — Byzantine accents (used only for ornaments, patterns, dividers,
        // NOT for the main brand surfaces)
        byzantine: {
          gold: '#b88a2e',
          'gold-deep': '#7c5d1d',
          parchment: '#f4ead2',
          'parchment-aged': '#e0d2ab',
          robe: '#5a4f72',
        },
      },
      fontFamily: {
        // Only 3 typefaces total:
        // 1) Cinzel Decorative — ecclesia / display, for grand titles
        // 2) Marcellus SC — ceremonial, for eyebrows, CTAs, captions
        // 3) Lora — serif / body / sans fallback, for everything else
        display: ['var(--font-cinzel-decorative)', 'Georgia', 'serif'],
        ecclesia: ['var(--font-cinzel-decorative)', 'Georgia', 'serif'],
        ceremonial: ['var(--font-marcellus-sc)', 'Georgia', 'serif'],
        nav: ['var(--font-cinzel)', 'Georgia', 'serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        body: ['var(--font-lora)', 'Georgia', 'serif'],
        sans: ['var(--font-lora)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Warm, candlelight-inspired shadows (browns and ambers, not cold grays)
        warm: '0 2px 10px -2px rgba(124, 93, 29, 0.12), 0 1px 3px rgba(124, 93, 29, 0.08)',
        'warm-md': '0 6px 20px -4px rgba(124, 93, 29, 0.18), 0 2px 6px rgba(124, 93, 29, 0.1)',
        'warm-lg': '0 16px 40px -8px rgba(60, 30, 10, 0.22), 0 4px 12px rgba(124, 93, 29, 0.14)',
        'warm-xl': '0 30px 60px -15px rgba(60, 30, 10, 0.28), 0 8px 20px rgba(124, 93, 29, 0.16)',
        candlelight: '0 0 40px -10px rgba(212, 169, 73, 0.55)',
        carved: 'inset 0 1px 0 rgba(255, 250, 235, 0.5), 0 1px 2px rgba(60, 30, 10, 0.15)',
      },
      backgroundImage: {
        'parchment-grain':
          "linear-gradient(180deg, rgba(247, 238, 219, 1) 0%, rgba(244, 234, 210, 1) 100%), url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.4 0 0 0 0 0.25 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        'byzantine-pattern':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='%23d4a949' stroke-width='0.6' opacity='0.35'><path d='M30 5 L35 15 L45 15 L37 22 L40 32 L30 26 L20 32 L23 22 L15 15 L25 15 Z'/><circle cx='30' cy='30' r='3'/></g></svg>\")",
      },
      keyframes: {
        'shimmer-slide': {
          to: { transform: 'translate(calc(100cqw - 100%), 0)' },
        },
        'spin-around': {
          '0%': { transform: 'translateZ(0) rotate(0)' },
          '15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
          '65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
          '100%': { transform: 'translateZ(0) rotate(360deg)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Candlelight flicker
        flicker: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.92', filter: 'brightness(1.08)' },
          '70%': { opacity: '0.96', filter: 'brightness(0.96)' },
        },
      },
      animation: {
        'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
        marquee: 'marquee var(--duration) linear infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        'fade-up': 'fade-up 0.6s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        flicker: 'flicker 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
