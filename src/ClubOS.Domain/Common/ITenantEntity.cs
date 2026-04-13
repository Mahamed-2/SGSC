namespace ClubOS.Domain.Common;

/// <summary>
/// Domain-specific multi-tenant interface representing entities explicitly attached to a sports Club.
/// </summary>
public interface ITenantEntity
{
    Guid ClubId { get; set; }
}
