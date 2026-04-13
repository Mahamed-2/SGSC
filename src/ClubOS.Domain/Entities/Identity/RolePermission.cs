using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities.Identity;

/// <summary>
/// Junction entity for Many-to-Many relationship between Roles and Permissions.
/// </summary>
public class RolePermission : TenantEntity
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }

    // Navigation properties
    public virtual Permission Permission { get; set; } = null!;
}
