/* tailwind.config.cjs */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // adjust if your folders differ
    "./styles/**/*.{css}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#1E40AF",
        dark: {
          bg: "#121212",
          card: "#1E1E1E",
          text: "#E5E5E5",
        },
      },
    },
  },
  plugins: [],
};
