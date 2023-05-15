/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'sfpro': ['SF Pro', 'sans-serif'],
      },
      colors: {
        "text": {
          100: "#667085",
          200: "#344054",
          300: "#101828"
        },
        "textBlue": {
          200: "#2D4EA2",
          300: "#2B2F43"
        },
        "bg": {
          300: "#2D4EA20B",
        }
      }
    },
  },
  plugins: [],
}
