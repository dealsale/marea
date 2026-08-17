import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base theme (Índigo) driven by CSS variables so it can flip light/dark.
        marea: {
          50: "rgb(var(--m50) / <alpha-value>)",
          100: "rgb(var(--m100) / <alpha-value>)",
          200: "rgb(var(--m200) / <alpha-value>)",
          300: "rgb(var(--m300) / <alpha-value>)",
          400: "rgb(var(--m400) / <alpha-value>)",
          500: "rgb(var(--m500) / <alpha-value>)",
          600: "rgb(var(--m600) / <alpha-value>)",
          700: "rgb(var(--m700) / <alpha-value>)",
          800: "rgb(var(--m800) / <alpha-value>)",
          900: "rgb(var(--m900) / <alpha-value>)",
          950: "rgb(var(--m950) / <alpha-value>)",
        },
        // Accent reserved for buttons / CTAs (Fucsia)
        magenta: {
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "gradient-x": "gradient-x 8s ease infinite",
      },
    },
  },
  plugins: [],
};
export default config;
