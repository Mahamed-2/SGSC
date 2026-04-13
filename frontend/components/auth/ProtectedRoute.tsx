"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/store/useStore";

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
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Is Authenticated?
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Role Check
    if (allowedRoles && allowedRoles.length > 0) {
      const hasRole = allowedRoles.includes(user.role);
      if (!hasRole) {
        setIsAuthorized(false);
        router.push("/unauthorized");
        return;
      }
    }

    // 3. Department Check (if applicable)
    // Assuming user object has a departmentIds string[] field or similar in the real API payload
    if (allowedDepartments && allowedDepartments.length > 0) {
      const userDepartments: string[] = typeof user.clubId === 'string' ? [user.clubId] : []; // Fallback for mockup
      // Check intersection
      const hasDept = allowedDepartments.some((d) => userDepartments.includes(d));
      if (!hasDept && user.role !== "SystemAdmin") {
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
