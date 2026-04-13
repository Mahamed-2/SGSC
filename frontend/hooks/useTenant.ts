"use client";

import { useTenantStore } from "@/lib/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { academiesApi } from "@/lib/api/client";

/**
 * useTenant — provides the current tenant with refetch capability.
 * Tenant data is held in Zustand (persisted) and validated server-side on mount.
 */
export function useTenant() {
  const { currentTenant, availableTenants, setCurrentTenant } = useTenantStore();

  const { data: academies, isLoading: academiesLoading } = useQuery({
    queryKey:  ["academies", currentTenant?.id],
    queryFn:   () => academiesApi.list(),
    enabled:   !!currentTenant,
    staleTime: 5 * 60_000, // 5 min
  });

  return {
    tenant:          currentTenant,
    availableTenants,
    setCurrentTenant,
    academies:       academies ?? [],
    academiesLoading,

    // Helpers
    tenantName: (locale: "ar-SA" | "en-US" = "ar-SA") =>
      locale === "ar-SA"
        ? (currentTenant?.nameAr ?? "")
        : (currentTenant?.nameEn ?? ""),

    isEnterprise: currentTenant?.plan === "Enterprise",
    isTrial:      currentTenant?.status === "Trial",
  };
}
