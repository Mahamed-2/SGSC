// Shared TypeScript types across the ClubOS frontend

// ── Auth / Tenant ─────────────────────────────────────────────────────────────
export interface Tenant {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  logoUrl?: string;
  plan: "Free" | "Starter" | "Growth" | "Enterprise";
  status: "Trial" | "Active" | "Suspended" | "Archived";
  settings: TenantSettings;
}

export interface TenantSettings {
  defaultLocale: "ar-SA" | "en-US";
  timeZone: string;
  rtlDefault: boolean;
  maxMembers: number;
  enableFeedback: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  nameAr: string;
  role: UserRole;
  tenantId: string;
  tenantSlug: string;
  avatarUrl?: string;
}

export type UserRole =
  | "SystemAdmin"
  | "TenantAdmin"
  | "AcademyManager"
  | "Coach"
  | "Staff";

// ── Members ────────────────────────────────────────────────────────────────────
export interface Member {
  id: string;
  fullNameEn: string;
  fullNameAr: string;
  nationalId: string;
  age: number;
  gender: "Male" | "Female";
  role: MemberRole;
  status: MemberStatus;
  email?: string;
  academyNameEn: string;
  academyNameAr: string;
  createdAt: string;
}

export type MemberRole =
  | "Player" | "Coach" | "Manager" | "Staff" | "Parent" | "Admin";

export type MemberStatus =
  | "Active" | "Inactive" | "Suspended" | "Graduated";

// ── Academy ────────────────────────────────────────────────────────────────────
export interface Academy {
  id: string;
  nameEn: string;
  nameAr: string;
  city: string;
  sportType: SportType;
  isActive: boolean;
  memberCount: number;
}

export type SportType =
  | "Football" | "Basketball" | "Swimming" | "Tennis" | "Athletics"
  | "MultiSport" | "Other";

// ── KPI ────────────────────────────────────────────────────────────────────────
export interface KpiRecord {
  id: string;
  academyId: string;
  type: KpiType;
  value: number;
  unit?: string;
  periodDate: string;
  notes?: string;
}

export type KpiType =
  | "AttendanceRate" | "MemberRetentionRate" | "RevenueMonthly"
  | "FeedbackSatisfactionScore" | "CoachToPlayerRatio" | "InjuryRate"
  | "TournamentWinRate" | "TrainingHoursPerWeek" | "ActiveMemberCount"
  | "ChurnRate"
  | "MatchWinRate" | "GoalsScoredPerMatch" | "YouthPromotionRate"
  | "InjuryFrequencyRate" | "RecoveryTimeAvg" | "BudgetUtilizationRate"
  | "SponsorshipRevenueGap" | "StaffRetentionRate" | "CertificationCompliance"
  | "StrategicGoalProgress" | "ESGAlignmentIndex";

export interface KpiSummary {
  type: KpiType;
  currentValue: number;
  previousValue: number;
  unit?: string;
  trend: "up" | "down" | "flat";
  changePercent: number;
}

// ── KPI Engine DTOs ────────────────────────────────────────────────────────
export interface ClubHealthScore {
  clubId: string;
  totalScore: number;
  categoryScores: Record<string, number>;
  calculatedAt: string;
}

export interface KpiValue {
  nameEn: string;
  nameAr: string;
  value: number;
  unit: string;
  trend: "Up" | "Down" | "Stable";
}

export interface PerformanceTrend {
  playerId: string;
  playerName: string;
  dataPoints: TrendPoint[];
}

export interface TrendPoint {
  date: string;
  metricType: string;
  value: number;
}

export interface ComplianceStatus {
  clubId: string;
  completionPercentage: number;
  requirements: ComplianceRequirement[];
}

export interface ComplianceRequirement {
  nameEn: string;
  nameAr: string;
  isMet: boolean;
  level: "Standard" | "Mandatory" | "Gold";
}


// ── Feedback ──────────────────────────────────────────────────────────────────
export interface FeedbackEntry {
  id: string;
  memberId: string;
  memberNameEn: string;
  memberNameAr: string;
  category: FeedbackCategory;
  sentiment: FeedbackSentiment;
  subject: string;
  body: string;
  status: FeedbackStatus;
  resolutionNote?: string;
  resolvedAt?: string;
  createdAt: string;
}

export type FeedbackCategory =
  | "Academic" | "Medical" | "Administrative" | "Facilities"
  | "Coaching" | "Safety" | "Other";

export type FeedbackSentiment = "Positive" | "Neutral" | "Negative" | "Critical";

export type FeedbackStatus =
  | "Open" | "UnderReview" | "Escalated" | "Resolved" | "Closed";

// ── API ────────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  messageEn?: string;
  messageAr?: string;
  errors?: string[];
  traceId?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ── UI ─────────────────────────────────────────────────────────────────────────
export interface NavItem {
  key: string;
  labelEn: string;
  labelAr: string;
  href: string;
  icon: string;
  badge?: number;
  roles: UserRole[];
  children?: NavItem[];
}

export type Locale = "ar-SA" | "en-US";
export type Direction = "rtl" | "ltr";
