/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#ff8901",
        secondary: "#fb923c"
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '9rem' 
        }
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], 
        orbitron: ["Orbitron", "sans-serif"],
      },
      screens: {
        'navlg': '980px',
      },
    },
  },
  plugins: [],
}