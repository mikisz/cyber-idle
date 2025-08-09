/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0d0f14',
        neon: {
          cyan: '#00ffff',
          magenta: '#ff00ff',
          yellow: '#ffff00'
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
