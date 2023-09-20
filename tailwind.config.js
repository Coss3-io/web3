const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.vue", "./public/index.html"],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "to": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
    animation: {
      slideIn: 'slideIn 0.3s ease-in-out 0.3s forwards',
    },
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
  },
  daisyui: {
    themes: ["dark"],
  },
  variants: {},
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
