using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities.Identity;

/// <summary>
/// Junction entity for assigning users to specific departments.
/// Supports multi-department assignment for staff (e.g. Coach serving both Football and Scouting).
/// </summary>
public class UserDepartment : TenantEntity
{
    public string UserId { get; set; } = null!;
    public Guid DepartmentId { get; set; }
    
    public bool IsPrimary { get; set; } = true;

    // Navigation properties
    public Department Department { get; set; } = null!;
}