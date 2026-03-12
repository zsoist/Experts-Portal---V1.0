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
        ink: "#0f172a",
        brand: "#0b6e4f",
        accent: "#f59e0b",
        mist: "#f4f7f4",
      },
    },
  },
  plugins: [],
};

export default config;
