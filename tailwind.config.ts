import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        celo: {
          green: "#35D07F",
          "green-strong": "#20E68A",
          gold: "#FBCC5C",
          blue: "#22D3EE",
        },
        dark: {
          background: "#060913",
          surface: "#101523",
          "surface-soft": "#151A2B",
        },
        impact: {
          background: "#060913",
          deep: "#080C18",
          surface: "#101523",
          elevated: "#151A2B",
          border: "rgba(53, 208, 127, 0.24)",
          text: "#F7F7FF",
          muted: "#A7A8C8",
          primary: "#35D07F",
          "primary-strong": "#20E68A",
          secondary: "#22D3EE",
          success: "#35D07F",
          reward: "#FBCC5C",
          accent: "#EC4899",
          purple: "#8B5CF6",
          "purple-strong": "#A855F7",
        },
      },
      boxShadow: {
        "neon-card":
          "0 16px 40px rgba(0, 0, 0, 0.22), 0 0 18px rgba(53, 208, 127, 0.08)",
        "neon-button":
          "0 10px 24px rgba(53, 208, 127, 0.18)",
        "neon-success": "0 0 20px rgba(53, 208, 127, 0.18)",
        "neon-reward": "0 0 20px rgba(251, 204, 92, 0.16)",
        "neon-community": "0 0 20px rgba(34, 211, 238, 0.14)",
      },
    },
  },
};

export default config;
