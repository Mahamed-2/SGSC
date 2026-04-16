import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
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

// ── Hydration slice ──────────────────────────────────────────────────────────
interface HydrationSlice {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// ── Combined store type ────────────────────────────────────────────────────────
type ClubOSStore = AuthSlice & TenantSlice & UISlice & HydrationSlice;

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

        // Hydration
        _hasHydrated: false,
        setHasHydrated: (state) => set({ _hasHydrated: state }, false, "setHasHydrated"),
      }),
      {
        name: "clubos-store",
        partialize: (s) => ({
          token:     s.token,
          user:      s.user,
          locale:    s.locale,
          direction: s.direction,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    { name: "ClubOS" }
  )
);

// ── Stable Granular Selectors ─────────────────────────────────────────────────

/**
 * useAuth: Returns auth state and actions.
 * Uses useShallow to prevent re-renders when other parts of the store change.
 */
export const useAuth = () => 
  useStore(useShallow((s) => ({ 
    user: s.user, 
    token: s.token, 
    isAuthenticated: s.isAuthenticated, 
    setAuth: s.setAuth, 
    clearAuth: s.clearAuth 
  })));

/**
 * useLocale: Returns locale and direction details.
 */
export const useLocale = () => 
  useStore(useShallow((s) => ({ 
    locale: s.locale, 
    direction: s.direction, 
    setLocale: s.setLocale 
  })));

/**
 * useSidebar: UI state for the navigation sidebar.
 */
export const useSidebar = () => 
  useStore(useShallow((s) => ({ 
    collapsed: s.sidebarCollapsed, 
    toggle: s.toggleSidebar,
    setCollapsed: s.setSidebarCollapsed
  })));

/**
 * useTenantStore: Tenant context and selection.
 */
export const useTenantStore = () => 
  useStore(useShallow((s) => ({ 
    currentTenant: s.currentTenant, 
    availableTenants: s.availableTenants, 
    setCurrentTenant: s.setCurrentTenant 
  })));

/**
 * useHydration: Checking if the store has rehydrated from persistent storage.
 * Essential for avoiding hydration mismatches in Next.js.
 */
export const useHydration = () => useStore((s) => s._hasHydrated);
