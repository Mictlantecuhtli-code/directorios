	/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aifa-blue': '#1e40af',
        'aifa-blue-light': '#3b82f6',
      },
    },
  },
  plugins: [],
}