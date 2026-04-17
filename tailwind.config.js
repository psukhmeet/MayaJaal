/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        matrix: {
          green: '#00ff41',
          dark: '#003b00',
          glow: '#39ff14',
        },
        loki: {
          gold: '#c9a84c',
          teal: '#1affe4',
          purple: '#7b2fbe',
        },
        emotion: {
          calm: '#4a90d9',
          joy: '#f5a623',
          fear: '#6b21a8',
          angry: '#e53e3e',
        },
      },
      animation: {
        'drift': 'drift 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'glitch': 'glitch 0.4s steps(2) infinite',
        'blob-morph': 'blobMorph 6s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-15px) translateX(8px)' },
          '66%': { transform: 'translateY(8px) translateX(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor' },
          '50%': { boxShadow: '0 0 25px currentColor, 0 0 50px currentColor' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
