import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'snowfall': 'snowfall 10s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        snowfall: {
          '0%': { transform: 'translateY(-10vh) translateX(0)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh) translateX(20px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
