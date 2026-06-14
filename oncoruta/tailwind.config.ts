import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9fafb",
        foreground: "#111928",
        primary: {
          DEFAULT: "#1a56db",
          dark: "#1e429f",
          light: "#e8f0fe",
        },
        sidebar: "#ffffff",
        border: "#e5e7eb",
        muted: "#6b7280",
        success: "#0e9f6e",
        warning: "#c27803",
        danger: "#e02424",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
