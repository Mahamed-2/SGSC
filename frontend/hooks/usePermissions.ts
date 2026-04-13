"use client";

import { useAuth } from "@/lib/store/useStore";
import { hasRole } from "@/lib/utils";
import type { UserRole } from "@/types";

/**
 * usePermissions — role-based permission helpers.
 * Mirrors the server-side authorization policies in ClubOS.API.
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role ?? "Staff";

  const can = (requiredRoles: UserRole[]): boolean =>
    !!user && hasRole(role, requiredRoles);

  return {
    role,

    // Named policy checks (mirror .NET authorization policies)
    isSystemAdmin:    can(["SystemAdmin"]),
    isTenantAdmin:    can(["SystemAdmin", "TenantAdmin"]),
    isManager:        can(["SystemAdmin", "TenantAdmin", "AcademyManager"]),
    canViewMembers:   can(["SystemAdmin", "TenantAdmin", "AcademyManager", "Coach"]),
    canEditMembers:   can(["SystemAdmin", "TenantAdmin", "AcademyManager"]),
    canViewKPIs:      can(["SystemAdmin", "TenantAdmin", "AcademyManager"]),
    canReviewFeedback:can(["SystemAdmin", "TenantAdmin", "AcademyManager"]),
    canManageTenants: can(["SystemAdmin"]),

    // Generic check
    can,
  };
}
