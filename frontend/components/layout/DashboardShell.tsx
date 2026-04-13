"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Breadcrumbs } from "./Breadcrumbs";
import { useLocalization } from "@/hooks/useLocalization";
import { useSidebar } from "@/lib/store/useStore";

interface DashboardShellProps {
  children: React.ReactNode;
  title?: { en: string; ar: string };
  actions?: React.ReactNode;
}

/**
 * DashboardShell — the main chrome wrapper for all dashboard pages.
 * Composes Sidebar + Topbar + content area with RTL-aware flex direction.
 */
export function DashboardShell({ children, title, actions }: DashboardShellProps) {
  const { isRTL, isArabic } = useLocalization();
  const { collapsed }       = useSidebar();

  return (
    <div
      className={cn(
        "flex min-h-screen bg-surface-muted",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ── A11y: Skip Link ─────────────────────────────────────────────── */}
      <a
        href="#main-content"
        className={cn(
          "absolute left-4 top-4 z-[100] px-4 py-2 bg-brand-500 text-white rounded-lg shadow-lg",
          "transform -translate-y-[200%] focus:translate-y-0 transition-transform duration-200 outline-none ring-2 ring-brand-gold"
        )}
      >
        {isArabic ? "تجاوز إلى المحتوى الرئيسي" : "Skip to main content"}
      </a>

      {/* Sidebar - Navigation Landmark */}
      <Sidebar />

      {/* Main content - Dynamic Landmark */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Sticky topbar - Header Landmark */}
        <Topbar />

        {/* Page content area */}
        <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
          <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
            {/* Page header */}
            {(title || actions) && (
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Breadcrumbs />
                  {title && (
                    <h1 className="text-2xl font-bold text-ink">
                      {isArabic ? title.ar : title.en}
                    </h1>
                  )}
                </div>
                {actions && (
                  <div className="flex items-center gap-2 shrink-0 pt-5">
                    {actions}
                  </div>
                )}
              </div>
            )}

            {/* Page body */}
            <div className="animate-fade-up">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
