import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Al-Faisaly × ClubOS Brand Tokens ───────────────────────────────
      colors: {
        brand: {
          50:  "#fff1f1",
          100: "#ffdfdf",
          200: "#ffc5c5",
          300: "#ff9d9d",
          400: "#ff6464",
          500: "var(--color-brand)",  // Use variable
          600: "var(--color-brand-dark)",
          700: "#890101",
          800: "#740101",
          900: "#610101",
          950: "#360000",
        },
        accent: {
          gold: "var(--color-accent-gold)",
          "gold-accessible": "#91751d", 
        },
        ring: {
          DEFAULT: "var(--color-brand)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          muted:   "var(--color-bg)",
          subtle:  "var(--color-border)", // Re-mapping for consistency
          border:  "var(--color-border)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          muted:   "var(--color-ink-muted)",
          faint:   "var(--color-ink-faint)",
        },
        // Semantic
        success:  { DEFAULT: "#16a34a", light: "#dcfce7" },
        warning:  { DEFAULT: "#d97706", light: "#fef3c7" },
        danger:   { DEFAULT: "#dc2626", light: "#fee2e2" },
        info:     { DEFAULT: "#2563eb", light: "#dbeafe" },
      },


      fontFamily: {
        sans: ["var(--font-mulish)", "ui-sans-serif", "system-ui"],
        arabic: ["var(--font-tajawal)", "Tahoma", "Arial", "sans-serif"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },

      borderRadius: {
        "4xl": "2rem",
      },

      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        sidebar: "16rem",      // 256px sidebar width
        "sidebar-collapsed": "4.5rem",
      },

      boxShadow: {
        card:   "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.08)",
        glow:   "0 0 0 3px rgb(45 158 45 / 0.18)",
      },

      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%":   { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(to right, #930101, #990101, #930101)",
        "hero-gradient":  "linear-gradient(-45deg, #8e1c1c, #990101)",
      },
      animation: {
        "fade-up":         "fade-up 0.3s ease-out",
        "slide-in-right":  "slide-in-right 0.25s ease-out",
        "slide-in-left":   "slide-in-left 0.25s ease-out",
        shimmer:           "shimmer 1.8s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
