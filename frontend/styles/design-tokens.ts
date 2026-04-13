// ── Design Token Specification ────────────────────────────────────────────────
// Figma-style token reference for ClubOS × Al-Faisaly brand system
// Use these constants in components instead of hard-coded values.

export const colors = {
  brand: {
    primary:   "#2d9e2d",   // Al-Faisaly green – buttons, highlights, active states
    secondary: "#217d21",   // Dark green – hover states
    light:     "#a8e4a8",   // Light green – badges, tags
    accent:    "#f0faf0",   // Tint – backgrounds, hover fills
    white:     "#ffffff",   // Al-Faisaly white – sidebar background (light)
  },
  neutral: {
    900: "#0f172a",
    700: "#334155",
    500: "#64748b",
    400: "#94a3b8",
    200: "#e2e8f0",
    100: "#f1f5f9",
    50:  "#f8fafc",
  },
  semantic: {
    success: { DEFAULT: "#16a34a", bg: "#dcfce7", border: "#86efac" },
    warning: { DEFAULT: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
    danger:  { DEFAULT: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
    info:    { DEFAULT: "#2563eb", bg: "#dbeafe", border: "#93c5fd" },
  },
  dark: {
    bg:      "#0b1120",
    surface: "#131c2e",
    border:  "#1e2d40",
  },
} as const;

export const typography = {
  fontFamily: {
    sans:   '"Inter", ui-sans-serif, system-ui',
    arabic: '"Cairo", Tahoma, Arial, sans-serif',
  },
  scale: {
    "2xs": { size: "0.625rem", lineHeight: "0.875rem" },
    xs:    { size: "0.75rem",  lineHeight: "1rem"     },
    sm:    { size: "0.875rem", lineHeight: "1.25rem"  },
    base:  { size: "1rem",     lineHeight: "1.5rem"   },
    lg:    { size: "1.125rem", lineHeight: "1.75rem"  },
    xl:    { size: "1.25rem",  lineHeight: "1.75rem"  },
    "2xl": { size: "1.5rem",   lineHeight: "2rem"     },
    "3xl": { size: "1.875rem", lineHeight: "2.25rem"  },
    "4xl": { size: "2.25rem",  lineHeight: "2.5rem"   },
  },
  weight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
} as const;

export const spacing = {
  sidebar:          "16rem",   // 256px – expanded
  sidebarCollapsed: "4.5rem",  // 72px  – icons only
  topbar:           "3.75rem", // 60px
  contentPadding:   "1.5rem",  // 24px
} as const;

export const borderRadius = {
  sm:   "0.375rem",  // 6px  – inputs, small badges
  base: "0.75rem",   // 12px – buttons
  lg:   "1rem",      // 16px – cards
  xl:   "1.5rem",    // 24px – modals, large cards
  full: "9999px",    // pills, avatars
} as const;

export const shadows = {
  card:      "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
  cardHover: "0 4px 12px 0 rgb(0 0 0 / 0.08)",
  glow:      "0 0 0 3px rgb(45 158 45 / 0.18)",
  modal:     "0 20px 60px -10px rgb(0 0 0 / 0.25)",
} as const;

export const animation = {
  fast:   "150ms ease",
  base:   "200ms ease",
  slow:   "300ms ease-out",
  spring: "400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

// KPI chart colors
export const chartColors = [
  colors.brand.primary,
  "#2563eb",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
] as const;
