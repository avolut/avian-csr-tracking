const colors = require('tailwindcss/colors')
delete colors.lightBlue

module.exports = {
  purge: {
    enabled: true,
    content: [
      './src/**/*.jsx',
      './src/**/*.tsx',
      './public/**/*.html',
      './src/**/*.html',
      '../web/**/*.tsx',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors,
      backgroundColor: colors,
      textColor: colors,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
