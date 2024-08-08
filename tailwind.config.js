/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#9FA6B2",
      },
      fontFamily: {
        sans: ["Comfortaa", "sans-serif"], // Set Comfortaa as the default sans-serif font
      },
      keyframes: {
        slideInOut: {
          "0%, 100%": { transform: "translateX(100%)", opacity: 0 },
          "10%, 90%": { transform: "translateX(0)", opacity: 1 },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "slide-in-out": "slideInOut 5s ease-in-out forwards",
        spin: "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure purge is set to remove unused styles in production
    "./public/index.html",
  ],
};
