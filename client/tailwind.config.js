/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#f472b6',
        accent: '#22d3ee',
        bgLight: '#f9fafb',
        bgDark: '#1f2937',
      },
    },
  },
  plugins: [],
}
