import { http, HttpResponse, delay } from "msw";
import type {
  Member, Academy, KpiSummary, FeedbackEntry, PaginatedResult, ApiResponse,
} from "@/types";

const BASE = "http://localhost:8080/api/v1";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const mockAcademies: Academy[] = [
  {
    id: "acc-001",
    nameEn: "Al-Faisaly Football Academy – Riyadh",
    nameAr: "أكاديمية الفيصلي لكرة القدم – الرياض",
    city: "Riyadh",
    sportType: "Football",
    isActive: true,
    memberCount: 142,
  },
  {
    id: "acc-002",
    nameEn: "Al-Faisaly Basketball Academy",
    nameAr: "أكاديمية الفيصلي لكرة السلة",
    city: "Harmah",
    sportType: "Basketball",
    isActive: true,
    memberCount: 68,
  },
];

const mockMembers: Member[] = [
  {
    id: "mem-001",
    fullNameEn: "Ahmed Al-Rashidi",
    fullNameAr: "أحمد الراشدي",
    nationalId: "1023456789",
    age: 17,
    gender: "Male",
    role: "Player",
    status: "Active",
    email: "ahmed@example.sa",
    academyNameEn: "Al-Faisaly Football Academy – Riyadh",
    academyNameAr: "أكاديمية الفيصلي لكرة القدم – الرياض",
    createdAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "mem-002",
    fullNameEn: "Khalid Al-Otaibi",
    fullNameAr: "خالد العتيبي",
    nationalId: "1034567890",
    age: 28,
    gender: "Male",
    role: "Coach",
    status: "Active",
    email: "khalid.coach@example.sa",
    academyNameEn: "Al-Faisaly Football Academy – Riyadh",
    academyNameAr: "أكاديمية الفيصلي لكرة القدم – الرياض",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "mem-003",
    fullNameEn: "Sara Al-Ghamdi",
    fullNameAr: "سارة الغامدي",
    nationalId: "2045678901",
    age: 19,
    gender: "Female",
    role: "Player",
    status: "Active",
    email: "sara@example.sa",
    academyNameEn: "Al-Faisaly Basketball Academy",
    academyNameAr: "أكاديمية الفيصلي لكرة السلة",
    createdAt: "2025-03-10T00:00:00Z",
  },
];

const mockKpiSummaries: KpiSummary[] = [
  { type: "AttendanceRate",           currentValue: 87.4, previousValue: 82.1, unit: "%",    trend: "up",   changePercent: 6.5  },
  { type: "MemberRetentionRate",      currentValue: 91.2, previousValue: 89.0, unit: "%",    trend: "up",   changePercent: 2.5  },
  { type: "RevenueMonthly",           currentValue: 142500, previousValue: 128000, unit: "SAR", trend: "up", changePercent: 11.3 },
  { type: "FeedbackSatisfactionScore",currentValue: 8.7,  previousValue: 8.2, unit: "/10",  trend: "up",   changePercent: 6.1  },
  { type: "ActiveMemberCount",        currentValue: 210, previousValue: 198, unit: "",       trend: "up",   changePercent: 6.1  },
  { type: "ChurnRate",                currentValue: 3.4,  previousValue: 4.2, unit: "%",    trend: "down", changePercent: 19.0 },
];

const mockFeedback: FeedbackEntry[] = [
  {
    id: "fb-001",
    memberId: "mem-001",
    memberNameEn: "Ahmed Al-Rashidi",
    memberNameAr: "أحمد الراشدي",
    category: "Coaching",
    sentiment: "Positive",
    subject: "Great training sessions",
    body: "The new training program is excellent.",
    status: "Resolved",
    createdAt: "2026-04-01T08:00:00Z",
  },
  {
    id: "fb-002",
    memberId: "mem-003",
    memberNameEn: "Sara Al-Ghamdi",
    memberNameAr: "سارة الغامدي",
    category: "Facilities",
    sentiment: "Negative",
    subject: "Locker room condition",
    body: "The locker rooms need maintenance.",
    status: "Open",
    createdAt: "2026-04-05T10:30:00Z",
  },
];

// ── Handlers ──────────────────────────────────────────────────────────────────
function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, messageEn: "OK", messageAr: "نجح الطلب" };
}

function paginated<T>(items: T[], page = 1, pageSize = 25): ApiResponse<PaginatedResult<T>> {
  const start = (page - 1) * pageSize;
  const sliced = items.slice(start, start + pageSize);
  return ok({
    items: sliced,
    totalCount: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
    hasPreviousPage: page > 1,
    hasNextPage: page < Math.ceil(items.length / pageSize),
  });
}

export const handlers = [
  // Academies
  http.get(`${BASE}/academies`, async () => {
    await delay(250);
    return HttpResponse.json(ok(mockAcademies));
  }),

  // Members
  http.get(`${BASE}/members`, async ({ request }) => {
    await delay(300);
    const url    = new URL(request.url);
    const page   = Number(url.searchParams.get("page") ?? "1");
    const role   = url.searchParams.get("role");
    const status = url.searchParams.get("status");
    let filtered = [...mockMembers];
    if (role)   filtered = filtered.filter((m) => m.role   === role);
    if (status) filtered = filtered.filter((m) => m.status === status);
    return HttpResponse.json(paginated(filtered, page));
  }),

  http.get(`${BASE}/members/:id`, async ({ params }) => {
    await delay(200);
    const member = mockMembers.find((m) => m.id === params.id);
    if (!member) return HttpResponse.json({ success: false }, { status: 404 });
    return HttpResponse.json(ok(member));
  }),

  http.post(`${BASE}/members`, async () => {
    await delay(500);
    return HttpResponse.json(ok("mem-" + Date.now()), { status: 201 });
  }),

  // KPIs
  http.get(`${BASE}/kpis/summaries`, async () => {
    await delay(350);
    return HttpResponse.json(ok(mockKpiSummaries));
  }),

  http.get(`${BASE}/kpis/history`, async () => {
    await delay(400);
    const history = Array.from({ length: 12 }, (_, i) => ({
      periodDate: new Date(2025, i, 1).toISOString(),
      value: 75 + Math.random() * 20,
    }));
    return HttpResponse.json(ok(history));
  }),

  // Feedback
  http.get(`${BASE}/feedback`, async ({ request }) => {
    await delay(300);
    const url    = new URL(request.url);
    const status = url.searchParams.get("status");
    let filtered = [...mockFeedback];
    if (status) filtered = filtered.filter((f) => f.status === status);
    return HttpResponse.json(paginated(filtered));
  }),

  // Health check (pass-through)
  http.get("http://localhost:8080/health", () =>
    HttpResponse.json({ status: "Healthy" })
  ),
];
