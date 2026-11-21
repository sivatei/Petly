export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f0f7f1',
          100: '#dcebdf',
          200: '#b9d7be',
          300: '#94c29c',
          400: '#6fae7c',
          500: '#5a9a6a',
          600: '#487f56',
          700: '#3a6646',
          800: '#2c4e35',
          900: '#1e3524'
        },
        cream: '#fbf6ea',
        ink: '#2b2f2d'
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif']
      }
    }
  }
};
