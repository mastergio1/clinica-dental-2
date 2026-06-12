/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        // Identidad derivada del logo real (#035390 / #4EA1D3), refinada
        // hacia un modo oscuro quirúrgico (contraste total con la web #1).
        night: {
          DEFAULT: '#0B1B2B', // azul noche, fondo base
          900: '#081523',
          800: '#0B1B2B',
          700: '#102639',
          600: '#16344c',
        },
        brand: {
          DEFAULT: '#035390', // azul del logo
          deep: '#024066',
          cyan: '#4EA1D3', // celeste del logo, acento principal
          glow: '#67c1f0',
        },
        surgical: '#F2F7FB', // blanco quirúrgico para texto
        success: '#3ECf8E', // verde-éxito discreto, solo para checks
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontVariantNumeric: ['tabular-nums'],
      maxWidth: {
        content: '1200px',
      },
      backgroundImage: {
        'blueprint':
          'linear-gradient(rgba(78,161,211,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(78,161,211,0.06) 1px, transparent 1px)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { opacity: '0' },
        },
        'float-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-up': 'float-up 0.7s ease forwards',
      },
    },
  },
  plugins: [],
};
