const colors = require('tailwindcss/colors')
delete colors.lightBlue

module.exports = {
  purge: {
    enabled: true,
    content: [
      './**/*.tsx',
      './**/*.html',
      './**/*.jsx',
      '../../pkgs/web/tailwind/tailwind.import.tsx',
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
