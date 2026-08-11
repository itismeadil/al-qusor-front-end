/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        noir: "#0A0A0A", // deep black, sophisticated
        pearl: "#FAFAFA", // pure white, clean
        ivory: "#F8F6F3", // soft off-white, warm undertone
        champagne: "#C9A962", // refined gold accent, elegant
        bronze: "#8B7355", // muted bronze, sophisticated
        charcoal: "#2C2C2C", // soft black, refined
        mist: "#E8E6E3", // subtle gray, elegant borders
        shadow: "#6B6B6B", // medium gray, secondary text
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        body: ['"Inter"', "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        88: "22rem",
        92: "23rem",
      },
    },
  },
  plugins: [],
};
