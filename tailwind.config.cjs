/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e8f1ff",
          100: "#d6e7ff",
          200: "#a6c8ff",
          300: "#76a9ff",
          400: "#468aff",
          500: "#1a6cff", // blue
          600: "#1556cc",
          700: "#104099",
          800: "#0b2b66",
          900: "#061633"
        }
      }
    }
  },
  plugins: []
};
