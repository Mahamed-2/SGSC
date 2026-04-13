"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/store/useStore";

export default function LogoutPage() {
  const { clearAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    clearAuth();
    
    // Redirect logic
    const redirect = searchParams?.get("redirect");
    if (redirect) {
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    } else {
      router.push("/login?loggedOut=true");
    }
  }, [clearAuth, router, searchParams]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--color-brand-primary))] border-t-transparent mx-auto" />
        <p className="text-muted-foreground text-lg">جاري تسجيل الخروج...</p>
      </div>
    </div>
  );
}
