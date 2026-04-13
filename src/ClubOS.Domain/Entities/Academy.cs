using ClubOS.Domain.Common;
using ClubOS.Domain.Enums;

namespace ClubOS.Domain.Entities;

/// <summary>
/// Represents a sports academy branch within a tenant.
/// E.g. "Al-Faisaly Football Academy – Riyadh".
/// </summary>
public sealed class Academy : TenantEntity
{
    private Academy() { }

    public string NameEn { get; private set; } = default!;
    public string NameAr { get; private set; } = default!;
    public string City { get; private set; } = default!;
    public SportType SportType { get; private set; }
    public string? Description { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Navigation
    public Guid TenantRef { get; private set; }
    public ICollection<Member> Members { get; private set; } = new List<Member>();
    public ICollection<KpiRecord> KpiRecords { get; private set; } = new List<KpiRecord>();

    public static Academy Create(Guid tenantId, string nameEn, string nameAr, string city, SportType sport)
        => new()
        {
            TenantId = tenantId,
            NameEn = nameEn,
            NameAr = nameAr,
            City = city,
            SportType = sport
        };

    public void Deactivate() => IsActive = false;
}
