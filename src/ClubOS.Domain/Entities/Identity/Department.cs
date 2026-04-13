using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities.Identity;

/// <summary>
/// Al-Faisaly FC operational department (Football Ops, Medical, Finance, HR, Scouting, Media).
/// A user may belong to multiple departments; access control is scoped per department.
/// </summary>
public sealed class Department : TenantEntity, ITenantEntity
{
    private Department() { } // EF ctor

    /// <summary>Inherits ClubId explicitly mapping to the underlying TenantId for DDD semantics.</summary>
    public Guid ClubId 
    { 
        get => TenantId; 
        set => TenantId = value; 
    }

    /// <summary>Department code used in permission keys (e.g. "MEDICAL", "FINANCE").</summary>
    public string Code { get; private set; } = default!;

    public string NameEn { get; private set; } = default!;

    public string NameAr { get; private set; } = default!;

    /// <summary>Optional parent, enabling nested department hierarchies.</summary>
    public Guid? ParentId { get; private set; }

    public bool IsActive { get; private set; } = true;

    // Navigation
    public ICollection<UserDepartment> UserDepartments { get; private set; } = new List<UserDepartment>();

    public static Department Create(Guid tenantId, string code, string nameEn, string nameAr, Guid? parentId = null)
        => new()
        {
            TenantId = tenantId,
            Code     = code.ToUpperInvariant(),
            NameEn   = nameEn,
            NameAr   = nameAr,
            ParentId = parentId,
        };

    public void Deactivate() => IsActive = false;
}

/// <summary>
/// Seeded Al-Faisaly department codes.
/// </summary>
public static class DepartmentCodes
{
    public const string FootballOps = "FOOTBALL_OPS";
    public const string Medical     = "MEDICAL";
    public const string Finance     = "FINANCE";
    public const string HR          = "HR";
    public const string Scouting    = "SCOUTING";
    public const string Media       = "MEDIA";

    public static readonly IReadOnlyList<(string Code, string En, string Ar)> All =
    [
        (FootballOps, "Football Operations", "العمليات الكروية"),
        (Medical,     "Medical Department",  "القسم الطبي"),
        (Finance,     "Finance",             "المالية"),
        (HR,          "Human Resources",     "الموارد البشرية"),
        (Scouting,    "Scouting",            "الكشافة"),
        (Media,       "Media",               "الإعلام"),
    ];
}
