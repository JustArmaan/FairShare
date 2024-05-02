/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.tsx', './index.html'],
  theme: {
    extend: {},
    colors: {
      'primary-dark-grey': '#686868',
      'primary-grey': '#E7E7E7',
      'accent-blue': '#4CAEF8',
      'accent-purple': '#9079FF',
      'accent-red': '#FF7969',
      'accent-yellow': '#FFCF72',
      'accent-green': '#00D59C',
      'pure-white': '#FFFFFF',
      'font-grey': '#8D8D93',
      'card-black': '#1C1C1E',
      'positive-number': '#37BA3C',
      'negative-number': '#DD4242',
      'font-black': '#2F2F2F',
      'font-off-white': '#F9F9F9',
      'primary-black-page': '#181616',
      'primary-black': '#343434',
      'primary-faded-black': '#4E4E4E',
      'primary-faded-black': '#4E4E4E',
      'primary-red': '#e60000',
    },
    fontFamily: {
      sans: ['Work Sans', 'sans-serif'],
    },
  },
  plugins: [],
};
