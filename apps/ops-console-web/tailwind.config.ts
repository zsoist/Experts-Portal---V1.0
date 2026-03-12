import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b1320",
        brand: "#1652f0",
        alert: "#c2410c",
        fog: "#f3f6fb",
      },
    },
  },
  plugins: [],
};

export default config;
