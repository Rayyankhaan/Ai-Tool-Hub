/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: { 50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81' },
        ink: '#0a0a0f',
        surface: '#fafafa',
      },
      borderRadius: { '3xl':'24px','4xl':'32px' },
      animation: {
        'float':'float 6s ease-in-out infinite',
        'slide-up':'slideUp 0.5s ease-out forwards',
        'fade-in':'fadeIn 0.6s ease-out forwards',
        'ticker':'ticker 30s linear infinite',
        'pulse-ring':'pulse-ring 1.5s ease-out infinite',
        'gradient':'gradient-shift 4s ease infinite',
      },
      backgroundImage: {
        'mesh': 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.10) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.08) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
