using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities.Identity;

/// <summary>
/// Atomic permission unit. Format: <c>RESOURCE:ACTION[:SCOPE]</c><br/>
/// Examples: <c>MEMBER:READ</c>, <c>MEDICAL:WRITE:OWN</c>, <c>FINANCE:DELETE:DEPT</c>
/// </summary>
public sealed class Permission : BaseEntity
{
    private Permission() { }

    /// <summary>Machine-readable key: RESOURCE:ACTION[:SCOPE].</summary>
    public string Key { get; private set; } = default!;

    public string DescriptionEn { get; private set; } = default!;
    public string DescriptionAr { get; private set; } = default!;

    /// <summary>Resource group (e.g. "MEMBER", "MEDICAL", "FINANCE").</summary>
    public string Resource { get; private set; } = default!;

    /// <summary>Action type: READ | WRITE | DELETE | APPROVE | EXPORT.</summary>
    public PermissionAction Action { get; private set; }

    /// <summary>Optional scope limiting to own records, own department, or entire tenant.</summary>
    public PermissionScope Scope { get; private set; }

    /// <summary>Whether this permission requires audit logging (CMA/Tadawul compliance).</summary>
    public bool RequiresAudit { get; private set; }

    // Navigation
    public ICollection<RolePermission> RolePermissions { get; private set; } = new List<RolePermission>();

    public static Permission Create(
        string key, string resource, PermissionAction action,
        PermissionScope scope, string descEn, string descAr, bool requiresAudit = false)
        => new()
        {
            Key            = key.ToUpperInvariant(),
            Resource       = resource.ToUpperInvariant(),
            Action         = action,
            Scope          = scope,
            DescriptionEn  = descEn,
            DescriptionAr  = descAr,
            RequiresAudit  = requiresAudit,
        };
}

/// <summary>Joining table: wires a ClubOS role to one or more permissions.</summary>
public sealed class RolePermission : TenantEntity
{
    public string    RoleId       { get; set; } = default!;  // ASP.NET Identity role ID
    public Guid      PermissionId { get; set; }
    public Permission Permission  { get; set; } = default!;

    /// <summary>Optional department scope; null means permission applies to all departments.</summary>
    public Guid? DepartmentId { get; set; }
}

/// <summary>Joining table: maps a user to one or more departments for scoped access.</summary>
public sealed class UserDepartment : TenantEntity
{
    public string     UserId       { get; set; } = default!;
    public Guid       DepartmentId { get; set; }
    public Department Department   { get; set; } = default!;

    /// <summary>Whether the user acts as the department admin within this dept.</summary>
    public bool IsDepartmentAdmin { get; set; }
    
    /// <summary>Whether this is the user's primary department (used for default UI scoping).</summary>
    public bool IsPrimary { get; set; } = true;
}

public enum PermissionAction { Read, Write, Delete, Approve, Export }
public enum PermissionScope  { Own, Department, Tenant, Platform }
