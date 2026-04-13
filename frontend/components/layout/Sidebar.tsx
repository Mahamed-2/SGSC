"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, MessageSquare,
  BarChart3, Settings, ChevronLeft, ChevronRight, ShieldCheck, Trophy,
  Activity, Wallet, Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/store/useStore";
import { useRTL } from "@/hooks/useLocalizedData";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/hooks/usePermissions";
import type { NavItem } from "@/types";

// ── Nav configuration ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "dashboard", href: "/dashboard", icon: "LayoutDashboard", roles: ["SystemAdmin", "TenantAdmin", "AcademyManager", "Coach", "Staff"] },
  { key: "members", href: "/dashboard/members", icon: "Users", roles: ["SystemAdmin", "TenantAdmin", "AcademyManager", "Coach"] },
  { key: "academies", href: "/dashboard/academies", icon: "Building2", roles: ["SystemAdmin", "TenantAdmin", "AcademyManager"] },
  { key: "kpis", href: "/dashboard/kpis", icon: "BarChart3", roles: ["SystemAdmin", "TenantAdmin", "AcademyManager"] },
  { key: "football", href: "/dashboard/football", icon: "Trophy", roles: ["SystemAdmin", "TenantAdmin", "AcademyManager", "Coach"] },
  { key: "medical", href: "/dashboard/medical", icon: "Activity", roles: ["SystemAdmin", "TenantAdmin", "MedicalStaff"] },
  { key: "finance", href: "/dashboard/finance", icon: "Wallet", roles: ["SystemAdmin", "TenantAdmin", "FinanceStaff"] },
  { key: "hr", href: "/dashboard/hr", icon: "Briefcase", roles: ["SystemAdmin", "TenantAdmin", "HRStaff"] },
  { key: "feedback", href: "/dashboard/feedback", icon: "MessageSquare", roles: ["SystemAdmin", "TenantAdmin", "AcademyManager"] },
  { key: "admin", href: "/admin/tenants", icon: "ShieldCheck", roles: ["SystemAdmin"] },
  { key: "settings", href: "/dashboard/settings", icon: "Settings", roles: ["SystemAdmin", "TenantAdmin", "AcademyManager"] },
];

const iconMap:Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Users, Building2, MessageSquare,
  BarChart3, Settings, ShieldCheck, Trophy,
  Activity, Wallet, Briefcase,
};

// ── Component ─────────────────────────────────────────────────────────────────
export function Sidebar() {
  const pathname          = usePathname();
  const { collapsed, toggle } = useSidebar();
  const t                 = useTranslations("sidebar");
  const { isRTL }         = useRTL();
  const { can }           = usePermissions();

  const visibleItems = NAV_ITEMS.filter(
    (item) => can(item.roles as Parameters<typeof can>[0])
  );

  const CollapseIcon = collapsed
    ? (isRTL ? ChevronLeft : ChevronRight)
    : (isRTL ? ChevronRight : ChevronLeft);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0",
        "bg-white dark:bg-surface border-e border-surface-border",
        "transition-[width] duration-250 ease-in-out overflow-hidden",
        collapsed ? "w-[4.5rem]" : "w-sidebar"
      )}
    >
      {/* ── Brand logo ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 h-[3.75rem] px-4 border-b border-surface-border shrink-0">
        <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        {!collapsed && (
          <div className="animate-fade-up overflow-hidden">
            <p className="font-bold text-ink text-sm leading-tight">ClubOS</p>
            <p className="text-ink-faint text-2xs">Al-Faisaly FC</p>
          </div>
        )}
      </div>

      {/* ── Nav items ──────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {visibleItems.map((item) => {
          const Icon      = iconMap[item.icon];
          const isActive  = pathname === item.href ||
                            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                "text-sm font-medium transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                isActive
                  ? "bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300"
                  : "text-ink-muted hover:bg-surface-subtle hover:text-ink",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? t(item.key) : undefined}
            >
              <Icon
                className={cn(
                  "shrink-0 w-4.5 h-4.5 transition-colors",
                  isActive
                    ? "text-brand-500"
                    : "text-ink-faint group-hover:text-ink-muted"
                )}
              />
              {!collapsed && (
                <span className="truncate animate-fade-up">
                  {t(item.key)}
                </span>
              )}
              {!collapsed && item.badge !== undefined && (
                <span className="ms-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white text-2xs font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Collapse toggle ────────────────────────────────────────────── */}
      <div className="px-2 pb-4 shrink-0">
        <button
          onClick={toggle}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5",
            "text-ink-faint hover:bg-surface-subtle hover:text-ink-muted",
            "text-sm font-medium transition-colors duration-150",
            collapsed && "justify-center px-0"
          )}
          aria-label="Toggle sidebar"
        >
          <CollapseIcon className="w-4 h-4 shrink-0" />
          {!collapsed && (
            <span className="animate-fade-up">{t("collapse")}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
