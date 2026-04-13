"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/store/useStore";
import { authApi } from "@/lib/api/client";
import { SessionTimeoutModal } from "./SessionTimeoutModal";

const TIMEOUT_MINUTES = 15;
const TIMEOUT_MS = TIMEOUT_MINUTES * 60 * 1000;
const WARNING_MS = (TIMEOUT_MINUTES - 1) * 60 * 1000; // Warn 1 min before

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token, clearAuth, setAuth, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(60);

  const lastActivity = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // ── Session Handling ──────────────────────────────────────────────────────────
  const handleActivity = useCallback(() => {
    lastActivity.current = Date.now();
    if (showTimeoutWarning) {
      // Don't auto-reset if the warning is already visible. They must click "Continue".
    }
  }, [showTimeoutWarning]);

  const logout = useCallback(() => {
    clearAuth();
    setShowTimeoutWarning(false);
    if (!pathname.startsWith("/login")) {
      router.push("/login?expired=true");
    }
  }, [clearAuth, pathname, router]);

  const continueSession = useCallback(() => {
    lastActivity.current = Date.now();
    setShowTimeoutWarning(false);
    setRemainingSeconds(60);
    // Optionally ping backend to refresh token here
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Listeners for activity
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, handleActivity));

    intervalRef.current = setInterval(() => {
      const idleTime = Date.now() - lastActivity.current;

      if (idleTime >= TIMEOUT_MS) {
        logout();
      } else if (idleTime >= WARNING_MS && !showTimeoutWarning) {
        setShowTimeoutWarning(true);
        setRemainingSeconds(Math.ceil((TIMEOUT_MS - idleTime) / 1000));
      }
    }, 5000); // Check every 5 seconds

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, handleActivity, logout, showTimeoutWarning]);

  // Countdown effect
  useEffect(() => {
    if (showTimeoutWarning && remainingSeconds > 0) {
      countdownRef.current = setTimeout(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (remainingSeconds <= 0) {
      logout();
    }
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [showTimeoutWarning, remainingSeconds, logout]);

  // ── Token Refresh (Optional background task) ────────────────────────────────
  // In a real app we parse the JWT expiry. For demo, we just rely on API 401s handled by Axios interceptor
  // or period refresh if needed.

  return (
    <>
      {children}
      {isAuthenticated && (
        <SessionTimeoutModal
          isOpen={showTimeoutWarning}
          remainingSeconds={remainingSeconds}
          onContinue={continueSession}
          onLogout={logout}
        />
      )}
    </>
  );
}
