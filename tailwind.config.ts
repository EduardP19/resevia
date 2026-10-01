import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#6D28D9',
          'purple-mid': '#7C3AED',
          'purple-light': '#8B5CF6',
          blue: '#2563EB',
          gold: '#C9A96E',
          'gold-light': '#D4B483',
          black: '#1C1917',
          gray: '#6B7280',
          light: '#F9F8FF',
          deep: '#271549',
          ink: '#0C0A1D',
          cream: '#FBF5E9',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(8%,-6%) scale(1.1)' },
          '66%': { transform: 'translate(-6%,5%) scale(0.95)' },
        },
        ring: {
          '0%': { transform: 'scale(0.9)', opacity: '0.8' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        float: 'float 6s ease-in-out infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        ring: 'ring 1.6s cubic-bezier(0.16,1,0.3,1) infinite',
        'spin-slow': 'spin-slow 22s linear infinite',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
