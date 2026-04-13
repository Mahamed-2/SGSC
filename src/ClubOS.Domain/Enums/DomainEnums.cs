namespace ClubOS.Domain.Enums;

public enum TenantPlan   { Free, Starter, Growth, Enterprise }
public enum TenantStatus { Trial, Active, Suspended, Archived }
public enum SportType    { Football, Basketball, Swimming, Tennis, Athletics, MultiSport, Other }
public enum Gender       { Male, Female }
public enum MemberRole   { Player, Coach, Manager, Staff, Parent, Admin }
public enum MemberStatus { Active, Inactive, Suspended, Graduated }

// ---------- Feedback Pillars ----------
public enum FeedbackCategory  { Academic, Medical, Administrative, Facilities, Coaching, Safety, Other }
public enum FeedbackSentiment { Positive, Neutral, Negative, Critical }
public enum FeedbackStatus    { Open, UnderReview, Escalated, Resolved, Closed }

// ---------- KPI Pillars ----------
public enum KpiType
{
    AttendanceRate,
    MemberRetentionRate,
    RevenueMonthly,
    FeedbackSatisfactionScore,
    CoachToPlayerRatio,
    InjuryRate,
    TournamentWinRate,
    TrainingHoursPerWeek,
    ActiveMemberCount,
    ChurnRate,

    // ── AL-FAISALY STRATEGIC KPIs ─────────────────────────────────────────
    MatchWinRate,
    GoalsScoredPerMatch,
    YouthPromotionRate,
    InjuryFrequencyRate,      // per 1000h
    RecoveryTimeAvg,          // days
    BudgetUtilizationRate,
    SponsorshipRevenueGap,
    StaffRetentionRate,
    CertificationCompliance,
    StrategicGoalProgress,
    ESGAlignmentIndex
}
