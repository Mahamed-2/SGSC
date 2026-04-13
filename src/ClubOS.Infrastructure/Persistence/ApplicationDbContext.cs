using ClubOS.Application.Common.Interfaces;
using ClubOS.Domain.Common;
using ClubOS.Domain.Entities;
using ClubOS.Domain.Interfaces;
using ClubOS.Domain.Entities.Identity;
using ClubOS.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MediatR;
using System.Reflection;

namespace ClubOS.Infrastructure.Persistence;

public sealed class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>, IApplicationDbContext
{
    private readonly IMediator _mediator;
    private readonly ITenantContext _tenantContext;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IMediator mediator,
        ITenantContext tenantContext) : base(options)
    {
        _mediator      = mediator;
        _tenantContext = tenantContext;
    }

    public DbSet<Tenant>        Tenants        => Set<Tenant>();
    public DbSet<Academy>       Academies      => Set<Academy>();
    public DbSet<Member>        Members        => Set<Member>();
    public DbSet<FeedbackEntry> FeedbackEntries => Set<FeedbackEntry>();
    public DbSet<KpiRecord>     KpiRecords     => Set<KpiRecord>();

    // ── RBAC & IDENTITY ───────────────────────────────────────────────────
    public DbSet<Department>     Departments     => Set<Department>();
    public DbSet<Permission>     Permissions     => Set<Permission>();
    public DbSet<AuditLog>       AuditLogs       => Set<AuditLog>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<UserDepartment> UserDepartments => Set<UserDepartment>();

    // ── CLUBOS DOMAIN ─────────────────────────────────────────────────────
    public DbSet<Club>              Clubs              => Set<Club>();
    public DbSet<Player>            Players            => Set<Player>();
    public DbSet<Staff>             StaffMembers       => Set<Staff>();
    public DbSet<TrainingSession>   TrainingSessions   => Set<TrainingSession>();
    public DbSet<PerformanceMetric> PerformanceMetrics => Set<PerformanceMetric>();
    public DbSet<FootballDrill>    FootballDrills     => Set<FootballDrill>();
    public DbSet<MatchPlan>        MatchPlans         => Set<MatchPlan>();

    // ── MEDICAL ──────────────────────────────────────────────────────────
    public DbSet<InjuryReport>         InjuryReports         => Set<InjuryReport>();
    public DbSet<TreatmentPlan>       TreatmentPlans       => Set<TreatmentPlan>();
    public DbSet<FitnessTest>         FitnessTests         => Set<FitnessTest>();
    public DbSet<ClearanceCertificate> ClearanceCertificates => Set<ClearanceCertificate>();

    // ── FINANCE ──────────────────────────────────────────────────────────
    public DbSet<BudgetItem>          BudgetItems          => Set<BudgetItem>();
    public DbSet<ExpenseReport>       ExpenseReports       => Set<ExpenseReport>();
    public DbSet<SponsorshipContract> SponsorshipContracts => Set<SponsorshipContract>();
    public DbSet<PayrollEntry>        PayrollEntries       => Set<PayrollEntry>();

    // ── HR ───────────────────────────────────────────────────────────────
    public DbSet<StaffProfile>        StaffProfiles        => Set<StaffProfile>();
    public DbSet<StaffCertification>  StaffCertifications  => Set<StaffCertification>();
    public DbSet<TrainingRecord>      TrainingRecords      => Set<TrainingRecord>();
    public DbSet<PerformanceReview>   PerformanceReviews   => Set<PerformanceReview>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Auto-register all IEntityTypeConfiguration<T> from this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // ── RBAC & IDENTITY CONFIGURATION ─────────────────────────────────────
        modelBuilder.Entity<RolePermission>()
            .HasKey(rp => new { rp.RoleId, rp.PermissionId, rp.DepartmentId });

        modelBuilder.Entity<UserDepartment>()
            .HasKey(ud => new { ud.UserId, ud.DepartmentId });

        // ── GLOBAL QUERY FILTERS ──────────────────────────────────────────────
        // Soft-delete filter: every TenantEntity automatically excludes IsDeleted rows
        modelBuilder.Entity<Academy>().HasQueryFilter(
            e => !e.IsDeleted && e.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<Member>().HasQueryFilter(
            e => !e.IsDeleted && e.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<FeedbackEntry>().HasQueryFilter(
            e => !e.IsDeleted && e.TenantId == _tenantContext.TenantId);
        modelBuilder.Entity<KpiRecord>().HasQueryFilter(
            e => !e.IsDeleted && e.TenantId == _tenantContext.TenantId);
        
        // Root entities
        modelBuilder.Entity<Tenant>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Club>().HasQueryFilter(e => !e.IsDeleted); // Club is isolated implicitly by its Id

        // ── CLUBOS DDD QUERY FILTERS (ClubId Enforcement) ──────────────────────
        modelBuilder.Entity<Department>().HasQueryFilter(
            e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<Player>().HasQueryFilter(
            e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<Staff>().HasQueryFilter(
            e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<TrainingSession>().HasQueryFilter(
            e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<PerformanceMetric>().HasQueryFilter(
            e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<FootballDrill>().HasQueryFilter(
            e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<MatchPlan>().HasQueryFilter(
            e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);

        // ── NEW MODULE FILTERS ───────────────────────────────────────────────
        modelBuilder.Entity<InjuryReport>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<TreatmentPlan>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<FitnessTest>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<ClearanceCertificate>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);

        modelBuilder.Entity<BudgetItem>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<ExpenseReport>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<SponsorshipContract>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<PayrollEntry>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);

        modelBuilder.Entity<StaffProfile>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<StaffCertification>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<TrainingRecord>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
        modelBuilder.Entity<PerformanceReview>().HasQueryFilter(e => !e.IsDeleted && e.ClubId == _tenantContext.TenantId);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // ── AUDIT TRAIL ───────────────────────────────────────────────────────
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        // ── DISPATCH DOMAIN EVENTS ────────────────────────────────────────────
        var domainEvents = ChangeTracker.Entries<BaseEntity>()
            .SelectMany(e => e.Entity.DomainEvents)
            .ToList();

        foreach (var entity in ChangeTracker.Entries<BaseEntity>().Select(e => e.Entity))
            entity.ClearDomainEvents();

        var result = await base.SaveChangesAsync(cancellationToken);

        foreach (var domainEvent in domainEvents)
            await _mediator.Publish(domainEvent, cancellationToken);

        return result;
    }
}
