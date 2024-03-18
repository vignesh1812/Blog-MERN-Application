/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    screens:{
      "xs":"320px",
      "sm":"640px",
      "md":"778px",
      "lg":"1024px",
      "xl":"1280px",
      "2xl":"2560px"
    },
    extend: {
      colors:{
        primary:"var(--primary)",
      }
    },
  },
  plugins: [],
}

