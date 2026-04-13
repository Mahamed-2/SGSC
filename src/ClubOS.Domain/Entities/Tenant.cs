using ClubOS.Domain.Common;
using ClubOS.Domain.Enums;
using ClubOS.Domain.Events;

namespace ClubOS.Domain.Entities;

/// <summary>
/// Represents a sports academy tenant (e.g., Al-Faisaly FC).
/// Root aggregate for the multi-tenant hierarchy.
/// </summary>
public sealed class Tenant : BaseEntity
{
    private Tenant() { } // EF Core ctor

    public string NameEn { get; private set; } = default!;
    public string NameAr { get; private set; } = default!;
    public string Slug { get; private set; } = default!;       // URL-safe identifier
    public string? LogoUrl { get; private set; }
    public string? Domain { get; private set; }                // Custom domain (optional)
    public TenantPlan Plan { get; private set; }
    public TenantStatus Status { get; private set; }
    public string? ContactEmail { get; private set; }
    public string? ContactPhone { get; private set; }
    public TenantSettings Settings { get; private set; } = new();

    // Navigation
    public ICollection<Academy> Academies { get; private set; } = new List<Academy>();
    public ICollection<Member> Members { get; private set; } = new List<Member>();

    public static Tenant Create(string nameEn, string nameAr, string slug, TenantPlan plan, string contactEmail)
    {
        var tenant = new Tenant
        {
            NameEn = nameEn,
            NameAr = nameAr,
            Slug = slug.ToLowerInvariant(),
            Plan = plan,
            Status = TenantStatus.Trial,
            ContactEmail = contactEmail
        };
        tenant.AddDomainEvent(new TenantCreatedEvent(tenant.Id, nameEn));
        return tenant;
    }

    public void Activate() { Status = TenantStatus.Active; AddDomainEvent(new TenantActivatedEvent(Id)); }
    public void Suspend(string reason) { Status = TenantStatus.Suspended; }
    public void UpdateSettings(TenantSettings settings) => Settings = settings;
}

/// <summary>Tenant-level configuration stored as owned type (JSON column in EF).</summary>
public sealed class TenantSettings
{
    public string DefaultLocale { get; set; } = "ar-SA";
    public string TimeZone { get; set; } = "Arab Standard Time";   // AST = UTC+3
    public bool RtlDefault { get; set; } = true;
    public int MaxMembers { get; set; } = 500;
    public bool EnableFeedback { get; set; } = true;
}
