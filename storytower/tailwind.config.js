/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.js", "./src/**/*.jsx", "./public/*.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f2fbfa",
          100: "#d1f6f2",
          200: "#a4ebe4",
          300: "#6edad4",
          400: "#40c1bd",
          500: "#27a5a4",
          600: "#1d8384",
          700: "#1d7072",
          800: "#1a5355",
          900: "#1a4547",
          950: "#09282a",
        },
      },
    },
  },
  plugins: [],
};
