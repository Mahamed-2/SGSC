"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalization } from "@/hooks/useLocalization";

interface BreadcrumbSegment {
  labelEn: string;
  labelAr: string;
  href?: string;
}

// Automatic segment mapping by route segment key
const SEGMENT_MAP: Record<string, { en: string; ar: string }> = {
  dashboard:  { en: "Dashboard",   ar: "لوحة التحكم"     },
  members:    { en: "Members",     ar: "الأعضاء"          },
  academies:  { en: "Academies",   ar: "الأكاديميات"      },
  kpis:       { en: "KPIs",        ar: "مؤشرات الأداء"    },
  feedback:   { en: "Feedback",    ar: "التغذية الراجعة"  },
  admin:      { en: "Admin",       ar: "الإدارة"           },
  tenants:    { en: "Tenants",     ar: "المستأجرون"        },
  settings:   { en: "Settings",   ar: "الإعدادات"          },
  new:        { en: "New",         ar: "إضافة"             },
};

export function Breadcrumbs() {
  const pathname       = usePathname();
  const { isArabic, t } = useLocalization();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .reduce<BreadcrumbSegment[]>((acc, seg, idx, arr) => {
      const label  = SEGMENT_MAP[seg];
      const isLast = idx === arr.length - 1;
      const href   = "/" + arr.slice(0, idx + 1).join("/");

      acc.push({
        labelEn: label?.en ?? seg,
        labelAr: label?.ar ?? seg,
        href:    isLast ? undefined : href,
      });
      return acc;
    }, []);

  if (segments.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-sm text-ink-faint"
    >
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const label  = isArabic ? seg.labelAr : seg.labelEn;

        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight
                className={cn(
                  "w-3.5 h-3.5 text-ink-faint",
                  isArabic && "rotate-180"
                )}
                aria-hidden
              />
            )}
            {seg.href ? (
              <Link
                href={seg.href}
                className="hover:text-ink transition-colors font-medium"
              >
                {label}
              </Link>
            ) : (
              <span className="text-ink font-semibold">{label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
