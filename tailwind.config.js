/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kiddy-blue': '#4fc3f7',
        'kiddy-orange': '#f29130',
        'kiddy-orange-dark': '#d35400',
        'kiddy-yellow': '#ffeb3b',
        'kiddy-cream': '#fffde7',
        'kiddy-green': '#a2d148',
      },
      fontFamily: {
        'fredoka': ['"Fredoka One"', 'cursive'],
        'quicksand': ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
