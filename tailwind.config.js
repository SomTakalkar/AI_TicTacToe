/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        neon: {
          blue: '#00f3ff',
          purple: '#bc13fe',
          green: '#0aff00',
          red: '#ff003c',
        },
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle at 50% 50%, rgba(16, 23, 42, 0) 0%, rgba(2, 6, 23, 0.8) 100%), linear-gradient(0deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
};
