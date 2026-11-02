/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f3efe6",
        ink: "#183132",
        wash: "#dfe7e2",
        sand: "#e9dfcd",
        rust: "#a25336",
        moss: "#586f61",
      },
      fontFamily: {
        // Keep existing font-serif classes working, but render them in Arial too.
        serif: ["Arial", "Tahoma", "Helvetica", "sans-serif"],
        sans: ["Arial", "Tahoma", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
