/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1A1A',
        paper: '#FAFAF9',
        clay: '#D4A017',
        slate: '#9CA3AF',
        line: '#E5E7EB'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        displayAr: ['"Marhey"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      }
    }
  },
  plugins: []
};
