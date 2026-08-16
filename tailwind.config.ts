import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base theme: royal blue (light → mid) fading into navy "raven" at the dark end
        marea: {
          50: "#eef4ff",
          100: "#dae4ff",
          200: "#bcd0ff",
          300: "#8fb0ff",
          400: "#5b86fb",
          500: "#3563e8",
          600: "#2247cf",
          700: "#1b39a6",
          800: "#13245e",
          900: "#0b1740",
          950: "#060c22",
        },
        // Accent reserved for buttons / CTAs
        magenta: {
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
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
