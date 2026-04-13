using ClubOS.Domain.Entities;
using ClubOS.Domain.Entities.Identity;
using ClubOS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClubOS.Application.Common.Interfaces;

/// <summary>
/// EF Core DbContext interface used by Application layer.
/// Keeps Application layer independent of EF Core implementation details.
/// </summary>
public interface IApplicationDbContext
{
    DbSet<Tenant> Tenants { get; }
    DbSet<Academy> Academies { get; }
    DbSet<Member> Members { get; }
    DbSet<FeedbackEntry> FeedbackEntries { get; }
    DbSet<KpiRecord> KpiRecords { get; }

    // ── RBAC & IDENTITY ───────────────────────────────────────────────────
    DbSet<Department>    Departments     { get; }
    DbSet<Permission>    Permissions     { get; }
    DbSet<AuditLog>      AuditLogs       { get; }
    DbSet<RolePermission> RolePermissions { get; }
    DbSet<UserDepartment> UserDepartments { get; }

    // ── CLUBOS DOMAIN ─────────────────────────────────────────────────────
    DbSet<Club>              Clubs              { get; }
    DbSet<Player>            Players            { get; }
    DbSet<Staff>             StaffMembers       { get; }
    DbSet<TrainingSession>   TrainingSessions   { get; }
    DbSet<PerformanceMetric> PerformanceMetrics { get; }
    DbSet<FootballDrill> FootballDrills { get; }
    DbSet<MatchPlan> MatchPlans { get; }

    // ── MEDICAL ──────────────────────────────────────────────────────────
    DbSet<InjuryReport> InjuryReports { get; }
    DbSet<TreatmentPlan> TreatmentPlans { get; }
    DbSet<FitnessTest> FitnessTests { get; }
    DbSet<ClearanceCertificate> ClearanceCertificates { get; }

    // ── FINANCE ──────────────────────────────────────────────────────────
    DbSet<BudgetItem> BudgetItems { get; }
    DbSet<ExpenseReport> ExpenseReports { get; }
    DbSet<SponsorshipContract> SponsorshipContracts { get; }
    DbSet<PayrollEntry> PayrollEntries { get; }

    // ── HR ───────────────────────────────────────────────────────────────
    DbSet<StaffProfile> StaffProfiles { get; }
    DbSet<StaffCertification> StaffCertifications { get; }
    DbSet<TrainingRecord> TrainingRecords { get; }
    DbSet<PerformanceReview> PerformanceReviews { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
