using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities.Identity;

/// <summary>
/// Immutable audit record for all authentication and authorization events.
/// Required for CMA / Tadawul regulatory compliance.
/// Stored in a separate append-only table; never updated or soft-deleted.
/// </summary>
public sealed class AuditLog
{
    /// <summary>Surrogate primary key (ULID-compatible sequential GUID).</summary>
    public Guid Id { get; private set; } = Guid.NewGuid();

    /// <summary>UTC timestamp of the event (always UTC; convert to AST in presentation layer).</summary>
    public DateTime OccurredAtUtc { get; private set; } = DateTime.UtcNow;

    /// <summary>User performing the action; null for unauthenticated attempts.</summary>
    public string? UserId { get; private set; }

    public string? UserEmail { get; private set; }

    /// <summary>Tenant context at event time; null for platform-level events.</summary>
    public Guid? TenantId { get; private set; }

    public AuditEventType EventType { get; private set; }

    /// <summary>Resource being accessed (e.g. "Member", "MedicalRecord").</summary>
    public string? Resource { get; private set; }

    /// <summary>Resource identifier if applicable.</summary>
    public string? ResourceId { get; private set; }

    /// <summary>Machine-readable outcome: Succeeded | Failed | Denied.</summary>
    public AuditOutcome Outcome { get; private set; }

    /// <summary>Free-text detail (failure reason, permission key checked, etc.).</summary>
    public string? Details { get; private set; }

    /// <summary>Client IP address (for Saudi regulatory reporting).</summary>
    public string? IpAddress { get; private set; }

    /// <summary>User-Agent string.</summary>
    public string? UserAgent { get; private set; }

    /// <summary>Correlation ID for distributed tracing.</summary>
    public string? CorrelationId { get; private set; }

    // ── Factory methods ────────────────────────────────────────────────────────

    public static AuditLog LoginSuccess(string userId, string email, Guid? tenantId, string? ip, string? ua, string? correlationId)
        => Build(userId, email, tenantId, AuditEventType.LoginSuccess, null, null, AuditOutcome.Succeeded, null, ip, ua, correlationId);

    public static AuditLog LoginFailed(string? email, Guid? tenantId, string reason, string? ip, string? ua, string? correlationId)
        => Build(null, email, tenantId, AuditEventType.LoginFailed, null, null, AuditOutcome.Failed, reason, ip, ua, correlationId);

    public static AuditLog TokenRefreshed(string userId, Guid? tenantId, string? ip, string? correlationId)
        => Build(userId, null, tenantId, AuditEventType.TokenRefreshed, null, null, AuditOutcome.Succeeded, null, ip, null, correlationId);

    public static AuditLog AccessDenied(string userId, Guid? tenantId, string resource, string permissionKey, string? ip, string? correlationId)
        => Build(userId, null, tenantId, AuditEventType.AccessDenied, resource, null, AuditOutcome.Denied, $"Required: {permissionKey}", ip, null, correlationId);

    public static AuditLog ResourceAccessed(string userId, Guid? tenantId, string resource, string resourceId, string? ip, string? correlationId)
        => Build(userId, null, tenantId, AuditEventType.ResourceAccessed, resource, resourceId, AuditOutcome.Succeeded, null, ip, null, correlationId);

    private static AuditLog Build(
        string? userId, string? userEmail, Guid? tenantId,
        AuditEventType eventType, string? resource, string? resourceId,
        AuditOutcome outcome, string? details,
        string? ip, string? ua, string? correlationId)
        => new()
        {
            UserId        = userId,
            UserEmail     = userEmail,
            TenantId      = tenantId,
            EventType     = eventType,
            Resource      = resource,
            ResourceId    = resourceId,
            Outcome       = outcome,
            Details       = details,
            IpAddress     = ip,
            UserAgent     = ua,
            CorrelationId = correlationId,
        };
}

public enum AuditEventType
{
    LoginSuccess,
    LoginFailed,
    Logout,
    TokenRefreshed,
    TokenRevoked,
    AccessDenied,
    ResourceAccessed,
    PasswordChanged,
    RoleAssigned,
    RoleRevoked,
    PermissionGranted,
    PermissionRevoked,
    UserCreated,
    UserSuspended,
    SaudiComplianceCheck,
}

public enum AuditOutcome { Succeeded, Failed, Denied }
