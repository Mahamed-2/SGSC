"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, useHydration } from "@/lib/store/useStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedDepartments?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
  allowedDepartments,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const hasHydrated = useHydration();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait for hydration to avoid incorrect redirects on first render
    if (!hasHydrated) return;

    // 1. Is Authenticated?
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Now we know user is defined
    const currentUser = user;

    // 2. Role Check
    if (allowedRoles && allowedRoles.length > 0) {
      const hasRole = allowedRoles.includes(currentUser.role);
      if (!hasRole) {
        setIsAuthorized(false);
        router.push("/unauthorized");
        return;
      }
    }

    // 3. Department Check (if applicable)
    if (allowedDepartments && allowedDepartments.length > 0) {
      const userDepartments: string[] = typeof currentUser.tenantId === 'string' ? [currentUser.tenantId] : [];
      // Check intersection
      const hasDept = allowedDepartments.some((d) => userDepartments.includes(d));
      if (!hasDept && currentUser.role !== "SystemAdmin") {
        setIsAuthorized(false);
        router.push("/unauthorized");
        return;
      }
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, allowedRoles, allowedDepartments, router, pathname]);

  if (isAuthorized === null) {
    // Return loading skeleton
    return (
      <div className="flex h-screen w-full items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[hsl(var(--color-brand-primary))] border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
