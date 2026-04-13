using Microsoft.AspNetCore.Identity;
using ClubOS.Domain.Entities.Identity;

namespace ClubOS.Infrastructure.Identity;

/// <summary>
/// Custom Identity User for ClubOS.
/// Extended with Multi-tenancy (ClubId) and Al-Faisaly department support.
/// </summary>
public sealed class ApplicationUser : IdentityUser
{
    /// <summary>
    /// The owning tenant (Club). Derived from verified JWT claims in requests.
    /// Mirrored as 'extension_ClubId' in B2C scenarios.
    /// </summary>
    public Guid ClubId { get; set; }

    /// <summary>
    /// User's preferred UI language (ar-SA or en-US).
    /// </summary>
    public string PreferredLanguage { get; set; } = "ar-SA";

    /// <summary>
    /// Last login time in Arab Standard Time (UTC+3).
    /// Strictly managed for Saudi governance audit trails.
    /// </summary>
    public DateTime? LastLoginAST { get; set; }

    // Navigation
    public ICollection<UserDepartment> UserDepartments { get; private set; } = new List<UserDepartment>();

    /// <summary>
    /// Helper to get user's time in Saudi Arabia.
    /// </summary>
    public DateTime GetCurrentAST() => TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.UtcNow, "Arab Standard Time");
}

/// <summary>
/// Custom Identity Role for ClubOS.
/// </summary>
public sealed class ApplicationRole : IdentityRole
{
    public ApplicationRole() : base() { }
    public ApplicationRole(string roleName) : base(roleName) { }

    // Navigation
    public ICollection<RolePermission> RolePermissions { get; private set; } = new List<RolePermission>();
}
