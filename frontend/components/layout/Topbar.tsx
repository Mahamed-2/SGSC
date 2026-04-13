"use client";

import { Bell, Sun, Moon, Globe, ChevronDown, LogOut, User, Zap } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, useTenantStore } from "@/lib/store/useStore";
import { usePerformance } from "@/providers/PerformanceProvider";
import { useDemo } from "@/providers/DemoProvider";
import type { Tenant } from "@/types";

// ── Tenant Switcher ────────────────────────────────────────────────────────────
function TenantSwitcher() {
  const { currentTenant, availableTenants, setCurrentTenant } = useTenantStore();
  const locale = useLocale();
  const isArabic = locale === "ar-SA";
  if (!currentTenant) return null;

  const name = isArabic ? currentTenant.nameAr : currentTenant.nameEn;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2",
          "text-sm font-medium text-ink-muted",
          "hover:bg-surface-subtle hover:text-ink",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          "transition-colors duration-150 max-w-[200px]"
        )}>
          <div className="w-5 h-5 rounded-md bg-brand-500 flex items-center justify-center shrink-0">
            <span className="text-white text-2xs font-bold">
              {currentTenant.nameEn.charAt(0)}
            </span>
          </div>
          <span className="truncate">{name}</span>
          <ChevronDown className="w-3.5 h-3.5 shrink-0 text-ink-faint" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          className={cn(
            "z-50 min-w-[200px] rounded-2xl border border-surface-border",
            "bg-white dark:bg-surface shadow-card-hover p-1",
            "animate-fade-up"
          )}
        >
          {availableTenants.map((tenant: Tenant) => (
            <DropdownMenu.Item
              key={tenant.id}
              onSelect={() => setCurrentTenant(tenant)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2",
                "text-sm cursor-pointer outline-none",
                "hover:bg-surface-subtle",
                tenant.id === currentTenant.id && "text-brand-600 font-medium"
              )}
            >
              {isArabic ? tenant.nameAr : tenant.nameEn}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function PerformanceToggle() {
  const { lowBandwidthMode, setLowBandwidthMode } = usePerformance();
  const locale = useLocale();

  return (
    <button
      onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-2.5 py-2",
        "text-sm font-medium transition-colors duration-150",
        lowBandwidthMode 
          ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" 
          : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
      )}
      title={lowBandwidthMode ? "High performance disabled" : "Optimized for performance"}
      aria-label="Toggle low bandwidth mode"
      aria-pressed={lowBandwidthMode}
    >
      <Zap className={cn("w-4 h-4", lowBandwidthMode ? "fill-current" : "")} />
      <span className="text-xs hidden md:block">
        {locale === "ar-SA" ? (lowBandwidthMode ? "نمط سريع" : "جودة عالية") : (lowBandwidthMode ? "Quick" : "High Qual")}
      </span>
    </button>
  );
}

// ── Locale Toggle ─────────────────────────────────────────────────────────────
function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = () => {
    const nextLocale = locale === "ar-SA" ? "en-US" : "ar-SA";
    // Standard next-intl URL replace pattern
    const nextPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(nextPath);
  };

  return (
    <button
      onClick={handleLocaleChange}
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-2.5 py-2",
        "text-sm font-medium text-ink-muted",
        "hover:bg-surface-subtle hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        "transition-colors duration-150"
      )}
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span className="text-xs">{locale === "ar-SA" ? "EN" : "عر"}</span>
    </button>
  );
}

// ── User Menu ─────────────────────────────────────────────────────────────────
function UserMenu() {
  const { user, clearAuth } = useAuth();
  const locale = useLocale();
  const isArabic = locale === "ar-SA";
  if (!user) return null;

  const displayName = isArabic ? user.nameAr : user.name;
  const initials    = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-surface-subtle transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden">
            <Avatar.Image src={user.avatarUrl} alt={displayName} className="object-cover" />
            <Avatar.Fallback className="flex items-center justify-center w-full h-full bg-brand-100 text-brand-700 text-xs font-semibold">
              {initials}
            </Avatar.Fallback>
          </Avatar.Root>
          <span className="text-sm font-medium text-ink max-w-[100px] truncate hidden sm:block">
            {displayName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-ink-faint hidden sm:block" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-[180px] rounded-2xl border border-surface-border bg-white dark:bg-surface shadow-card-hover p-1 animate-fade-up"
        >
          <div className="px-3 py-2 border-b border-surface-border mb-1">
            <p className="text-xs font-medium text-ink">{displayName}</p>
            <p className="text-2xs text-ink-faint">{user.role}</p>
          </div>

          <DropdownMenu.Item className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm cursor-pointer hover:bg-surface-subtle outline-none">
            <User className="w-4 h-4 text-ink-faint" />
            {isArabic ? "الملف الشخصي" : "Profile"}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-surface-border my-1" />

          <DropdownMenu.Item
            onSelect={clearAuth}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm cursor-pointer text-danger-DEFAULT hover:bg-danger-light outline-none"
          >
            <LogOut className="w-4 h-4" />
            {isArabic ? "تسجيل الخروج" : "Sign out"}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function DemoStatusTray() {
  const { isDemoMode, activePersona, setPersona } = useDemo();
  const locale = useLocale();
  if (!isDemoMode) return null;

  return (
    <div className="flex items-center gap-3 bg-brand-50/80 dark:bg-brand-500/10 px-3 py-1.5 rounded-2xl border border-brand-200 dark:border-brand-500/20">
      <span className="flex items-center gap-1.5 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
        <span className="text-[10px] font-bold text-brand-700 dark:text-brand-300 uppercase tracking-widest">
          Demo Mode
        </span>
      </span>
      
      <div className="h-4 w-px bg-brand-200 dark:bg-brand-500/20" />

      <select 
        value={activePersona}
        onChange={(e) => setPersona(e.target.value)}
        className="bg-transparent text-xs font-semibold text-brand-900 dark:text-white border-none focus:ring-0 p-0 cursor-pointer"
      >
        <option value="admin">System Admin</option>
        <option value="coach">Head Coach</option>
        <option value="board">Executive Board</option>
      </select>
    </div>
  );
}

// ── Topbar Component ───────────────────────────────────────────────────────────
export function Topbar() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("topbar");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-surface px-6 shrink-0 transition-all dark:bg-dark-surface dark:border-dark-border">
      <div className="flex items-center gap-6">
        <TenantSwitcher />
        <DemoStatusTray />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 ms-auto">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl text-ink-faint hover:bg-surface-subtle hover:text-ink-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Toggle theme"
        >
          {theme === "dark"
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />}
        </button>

        {/* Performance toggle */}
        <PerformanceToggle />

        {/* Locale toggle */}
        <LocaleToggle />

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-ink-faint hover:bg-surface-subtle hover:text-ink-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-danger-DEFAULT" />
        </button>

        {/* User menu */}
        <div className="ms-1">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
