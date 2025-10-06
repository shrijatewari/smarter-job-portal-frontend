/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        milkyCoffee: "#9B7D61",
        roastedPeach: "#DAA38F",
        wholeWheat: "#E9D7C0",
        eucalyptus: "#92ADA4",
        cream: "#FED8A6",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
