const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.vue", "./src/types/*.ts", "./public/index.html"],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
    animation: {
      slideIn: "slideIn 0.3s ease-in-out 0.3s forwards",
      ...defaultTheme.animation,
    },
    screens: {
      xs: "385px",
      ...defaultTheme.screens,
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#7e21cf", 
        },
      },
    ],
  },
  variants: {},
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
