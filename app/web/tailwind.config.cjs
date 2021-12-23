const colors = require('tailwindcss/colors')
delete colors.lightBlue

module.exports = {
  content: [
    './src/**/*.jsx',
    './src/**/*.tsx',
    './public/**/*.html',
    './src/**/*.html',
    '../../pkgs/web/tailwind/tailwind.import.tsx',
  ],
  theme: {
    extend: {
      colors,
      backgroundColor: colors,
      textColor: colors,
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
