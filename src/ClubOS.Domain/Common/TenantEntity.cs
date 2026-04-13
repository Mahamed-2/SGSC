namespace ClubOS.Domain.Common;

/// <summary>
/// Extends BaseEntity with tenant isolation. Every persisted entity in a multi-tenant
/// context should derive from this class to ensure column-level TenantId filtering.
/// </summary>
public abstract class TenantEntity : BaseEntity
{
    /// <summary>
    /// Identifies the owning tenant. Populated by TenantContext middleware.
    /// Never trust client-supplied values – always set from the verified JWT claim.
    /// </summary>
    public Guid TenantId { get; set; }
}
