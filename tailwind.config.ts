import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        moss: "#111111",
        porcelain: "#FAFAF7",
        paper: "#FFFFFF",
        oxblood: "#9f322c",
        brass: "#b08a42",
        mist: "#E9FFF5",
        mint: "#7DFFC9",
        violet: "#8A5CF6",
        electric: "#2B7BFF"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 32, 29, 0.10)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        serif: ["Georgia", "Times New Roman", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
