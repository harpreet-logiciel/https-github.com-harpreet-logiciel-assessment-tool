/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'logiciel': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
