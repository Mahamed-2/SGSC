"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { membersApi } from "@/lib/api/client";
import { useLocalization } from "@/hooks/useLocalization";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/lib/utils";
import type { Member } from "@/types";

const STATUS_COLORS = {
  Active:    "bg-success-light text-success-DEFAULT",
  Inactive:  "bg-surface-subtle text-ink-muted",
  Suspended: "bg-danger-light text-danger-DEFAULT",
  Graduated: "bg-info-light text-info-DEFAULT",
};

function MembersTable({ members }: { members: Member[] }) {
  const { isArabic, fmtDate } = useLocalization();
  const { canEditMembers }    = usePermissions();

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-surface-subtle border-b border-surface-border">
          <tr>
            {[
              { en: "Member", ar: "العضو" },
              { en: "National ID", ar: "رقم الهوية" },
              { en: "Role", ar: "الدور" },
              { en: "Academy", ar: "الأكاديمية" },
              { en: "Status", ar: "الحالة" },
              { en: "Since", ar: "منذ" },
            ].map((h) => (
              <th
                key={h.en}
                className="px-4 py-3 text-start text-xs font-semibold text-ink-faint uppercase tracking-wide"
              >
                {isArabic ? h.ar : h.en}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {members.map((m) => (
            <tr key={m.id} className="hover:bg-surface-subtle/50 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-ink">
                  {isArabic ? m.fullNameAr : m.fullNameEn}
                </p>
                <p className="text-xs text-ink-faint">{m.email}</p>
              </td>
              <td className="px-4 py-3 text-ink-muted font-mono text-xs">{m.nationalId}</td>
              <td className="px-4 py-3 text-ink-muted">{m.role}</td>
              <td className="px-4 py-3 text-ink-muted">
                {isArabic ? m.academyNameAr : m.academyNameEn}
              </td>
              <td className="px-4 py-3">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  STATUS_COLORS[m.status]
                )}>
                  {m.status}
                </span>
              </td>
              <td className="px-4 py-3 text-ink-muted text-xs">
                {fmtDate(m.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MembersPage() {
  const { isArabic } = useLocalization();
  const { canEditMembers } = usePermissions();

  const { data, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn:  () => membersApi.list({}),
  });

  return (
    <DashboardShell
      title={{ en: "Members", ar: "الأعضاء" }}
      actions={
        canEditMembers ? (
          <button className="btn-primary">
            {isArabic ? "+ إضافة عضو" : "+ Add Member"}
          </button>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-14 rounded-xl" />
          ))}
        </div>
      ) : (
        <MembersTable members={data?.items ?? []} />
      )}
    </DashboardShell>
  );
}
