import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: "#0A0A12",
          surface: "#12121E",
          border: "#1E1E3A",
          text: "#F0F0FF",
          muted: "#8888AA",
          purple: "#7C3AED",
          violet: "#A855F7",
          cyan: "#06B6D4",
        },
      },
      boxShadow: {
        "arena-glow": "0 0 20px rgba(168, 85, 247, 0.4)",
      },
    },
  },
};

export default config;
