import type { Config } from "tailwindcss";
import { tailwindExtend } from "./src/lib/design-system";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      ...tailwindExtend,
      // Additional custom extensions
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s ease-in-out 2',
      },
      backgroundImage: {
        'gradient-aurora': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
        'gradient-orange-glow': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};

export default config;



