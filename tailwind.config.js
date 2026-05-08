/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 30px 90px rgba(17,24,39,.08)"
      }
    }
  },
  plugins: []
};
