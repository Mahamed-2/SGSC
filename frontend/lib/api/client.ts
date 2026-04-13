import axios from "axios";
import { useStore } from "@/lib/store/useStore";
import type { ApiResponse, PaginatedResult, Member, KpiSummary, FeedbackEntry, Academy } from "@/types";

// ── Axios instance ─────────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "ar-SA",  // default; overridden per-request
  },
  timeout: 15_000,
});

// ── Request interceptor: attach JWT + locale ───────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const { token, locale } = useStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept-Language"] = locale ?? "ar-SA";
  return config;
});

// ── Response interceptor: handle 401 ─────────────────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useStore.getState().clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── API helpers ───────────────────────────────────────────────────────────────
async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await apiClient.get<ApiResponse<T>>(url, { params });
  if (!data.success || !data.data) throw new Error(data.messageEn ?? "API error");
  return data.data;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.post<ApiResponse<T>>(url, body);
  if (!data.success || !data.data) throw new Error(data.messageEn ?? "API error");
  return data.data;
}

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (credentials: Record<string, string>) => post<any>("/auth/login", credentials),
  refresh: (tokens: { token: string; refreshToken: string }) => post<any>("/auth/refresh", tokens),
};

// ── Members API ────────────────────────────────────────────────────────────────
export const membersApi = {
  list: (params: { academyId?: string; role?: string; status?: string; page?: number; pageSize?: number }) =>
    get<PaginatedResult<Member>>("/members", params),
  getById: (id: string) => get<Member>(`/members/${id}`),
  create: (body: Partial<Member>) => post<string>("/members", body),
  suspend: (id: string) => apiClient.post(`/members/${id}/suspend`),
  activate: (id: string) => apiClient.post(`/members/${id}/activate`),
};

// ── Academies API ─────────────────────────────────────────────────────────────
export const academiesApi = {
  list: () => get<Academy[]>("/academies"),
  getById: (id: string) => get<Academy>(`/academies/${id}`),
};

// ── KPI API ───────────────────────────────────────────────────────────────────
export const kpiApi = {
  getSummaries: (academyId?: string) =>
    get<KpiSummary[]>("/kpis/summaries", { academyId }),
  getHistory: (academyId: string, type: string, months: number = 12) =>
    get<{ periodDate: string; value: number }[]>("/kpis/history", { academyId, type, months }),

  // ── KPI Engine Extensions ───────────────────────────────────────────────
  getHealthScore: (clubId: string) =>
    get<import("@/types").ClubHealthScore>(`/kpis/clubs/${clubId}/health-score`),
  
  getDepartmentKpis: (clubId: string, deptCode: string) =>
    get<import("@/types").KpiValue[]>(`/kpis/clubs/${clubId}/departments/${deptCode}`),
  
  getPlayerTrends: (clubId: string, playerId: string, start: string, end: string) =>
    get<import("@/types").PerformanceTrend>(`/kpis/clubs/${clubId}/players/${playerId}/trends`, { start, end }),
  
  getComplianceStatus: (clubId: string) =>
    get<import("@/types").ComplianceStatus>(`/kpis/clubs/${clubId}/compliance`),
};

// ── Feedback API ──────────────────────────────────────────────────────────────
export const feedbackApi = {
  list: (params: { status?: string; category?: string; page?: number }) =>
    get<PaginatedResult<FeedbackEntry>>("/feedback", params),
  submit: (body: Partial<FeedbackEntry>) => post<string>("/feedback", body),
  resolve: (id: string, note: string) => apiClient.post(`/feedback/${id}/resolve`, { note }),
};
