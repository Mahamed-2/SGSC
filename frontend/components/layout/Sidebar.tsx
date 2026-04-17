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
interface SidebarItem {
  key: string;
  href: string;
  icon: string;
  roles: string[];
  badge?: number | string;
}

const NAV_ITEMS: SidebarItem[] = [
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
        "flex flex-col h-screen sticky top-0 z-40 transition-[width] duration-300 ease-in-out",
        "bg-[#0f0f0f] text-[#9ca3af] border-r border-[#1f1f1f]",
        collapsed ? "w-[5rem]" : "w-[17rem]"
      )}
    >
      {/* ── Brand logo ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 h-[4rem] px-6 border-b border-[#1f1f1f] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        {!collapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <p className="font-bold text-white text-sm tracking-tight">ClubOS</p>
            <p className="text-[#6b7280] text-[10px] uppercase tracking-widest font-semibold">Enterprise</p>
          </div>
        )}
      </div>

      {/* ── Nav items ──────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        {/* Analytics Group */}
        <div>
           {!collapsed && <p className="px-3 mb-2 text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Analytics</p>}
           <div className="space-y-1">
             {visibleItems.filter(i => ["dashboard", "kpis"].includes(i.key)).map((item) => (
               <SidebarLink key={item.key} item={item} collapsed={collapsed} pathname={pathname} t={t} />
             ))}
           </div>
        </div>

        {/* Club Management Group */}
        <div>
           {!collapsed && <p className="px-3 mb-2 text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Management</p>}
           <div className="space-y-1">
             {visibleItems.filter(i => ["members", "academies", "football", "medical", "finance", "hr"].includes(i.key)).map((item) => (
               <SidebarLink key={item.key} item={item} collapsed={collapsed} pathname={pathname} t={t} />
             ))}
           </div>
        </div>

        {/* System Group */}
        <div>
           {!collapsed && <p className="px-3 mb-2 text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">System</p>}
           <div className="space-y-1">
             {visibleItems.filter(i => ["feedback", "admin", "settings"].includes(i.key)).map((item) => (
               <SidebarLink key={item.key} item={item} collapsed={collapsed} pathname={pathname} t={t} />
             ))}
           </div>
        </div>
      </nav>

      {/* ── Collapse toggle ────────────────────────────────────────────── */}
      <div className="p-4 border-t border-[#1f1f1f] shrink-0">
        <button
          onClick={toggle}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5",
            "text-[#6b7280] hover:bg-[#1f1f1f] hover:text-white",
            "text-sm font-medium transition-all duration-200",
            collapsed && "justify-center px-0"
          )}
        >
          <CollapseIcon className="w-4 h-4 shrink-0" />
          {!collapsed && <span>{t("collapse")}</span>}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ item, collapsed, pathname, t }: { item: SidebarItem, collapsed: boolean, pathname: string, t: any }) {
  const Icon     = iconMap[item.icon];
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5",
        "text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-[#1f1f1f] text-white"
          : "text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-[#d1d5db]",
        collapsed && "justify-center px-0"
      )}
      title={collapsed ? t(item.key) : undefined}
    >
      {/* Active Indicator Line */}
      {isActive && (
        <div className="absolute left-0 top-2 bottom-2 w-1 bg-brand-500 rounded-r-full" />
      )}
      
      <Icon
        className={cn(
          "shrink-0 w-5 h-5 transition-transform duration-200 group-hover:scale-110",
          isActive ? "text-brand-500" : "text-[#4b5563] group-hover:text-[#9ca3af]"
        )}
      />
      {!collapsed && (
        <span className="truncate">
          {t(item.key)}
        </span>
      )}
    </Link>
  );
}
