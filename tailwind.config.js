const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.vue', './public/index.html',],
  theme: {
    screens: {
    xs: '475px',
    ...defaultTheme.screens,
      },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#661AE6",
          secondary: "#D926AA",
          accent: "#1FB2A5",
          neutral: "#191D24",
          "base-100": "#2A303C",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
  variants: {},
  plugins: [require("@tailwindcss/typography"),require("daisyui")],
}

