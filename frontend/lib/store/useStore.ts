import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { AuthUser, Locale, Tenant } from "@/types";
import { getDirection } from "@/lib/utils";

// ── Auth slice ─────────────────────────────────────────────────────────────────
interface AuthSlice {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
}

// ── Tenant slice ───────────────────────────────────────────────────────────────
interface TenantSlice {
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  setCurrentTenant: (tenant: Tenant) => void;
  setAvailableTenants: (tenants: Tenant[]) => void;
}

// ── UI / Locale slice ──────────────────────────────────────────────────────────
interface UISlice {
  locale: Locale;
  direction: "rtl" | "ltr";
  sidebarCollapsed: boolean;
  setLocale: (locale: Locale) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

// ── Combined store type ────────────────────────────────────────────────────────
type ClubOSStore = AuthSlice & TenantSlice & UISlice;

export const useStore = create<ClubOSStore>()(
  devtools(
    persist(
      (set) => ({
        // Auth
        user: null,
        token: null,
        isAuthenticated: false,
        setAuth: (user, token) =>
          set({ user, token, isAuthenticated: true }, false, "setAuth"),
        clearAuth: () =>
          set({ user: null, token: null, isAuthenticated: false }, false, "clearAuth"),

        // Tenant
        currentTenant: null,
        availableTenants: [],
        setCurrentTenant: (tenant) =>
          set({ currentTenant: tenant }, false, "setCurrentTenant"),
        setAvailableTenants: (tenants) =>
          set({ availableTenants: tenants }, false, "setAvailableTenants"),

        // UI
        locale: "ar-SA",
        direction: "rtl",
        sidebarCollapsed: false,
        setLocale: (locale) =>
          set(
            { locale, direction: getDirection(locale) },
            false,
            "setLocale"
          ),
        toggleSidebar: () =>
          set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }), false, "toggleSidebar"),
        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed }, false, "setSidebarCollapsed"),
      }),
      {
        name: "clubos-store",
        partialize: (s) => ({
          // Only persist these fields to localStorage
          token:     s.token,
          user:      s.user,
          locale:    s.locale,
          direction: s.direction,
        }),
      }
    ),
    { name: "ClubOS" }
  )
);

// Convenience selectors
export const useAuth       = () => useStore((s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated, setAuth: s.setAuth, clearAuth: s.clearAuth }));
export const useLocale     = () => useStore((s) => ({ locale: s.locale, direction: s.direction, setLocale: s.setLocale }));
export const useSidebar    = () => useStore((s) => ({ collapsed: s.sidebarCollapsed, toggle: s.toggleSidebar }));
export const useTenantStore = () => useStore((s) => ({ currentTenant: s.currentTenant, availableTenants: s.availableTenants, setCurrentTenant: s.setCurrentTenant }));
