using Microsoft.AspNetCore.Authorization;

namespace ClubOS.Infrastructure.Identity.Authorization.Requirements;

/// <summary>
/// Ensures a user has access to a specific department.
/// Logic: User must have a 'dept' claim matching the required ID, or be a ClubAdmin.
/// </summary>
public sealed record DepartmentAccessRequirement(string Resource, string Action) : IAuthorizationRequirement;

/// <summary>
/// Ensures a user is isolated within their tenant.
/// Logic: 'tenant_id' claim must match the resource's TenantId.
/// </summary>
public sealed record TenantIsolationRequirement : IAuthorizationRequirement;

/// <summary>
/// Ensures access to high-value resources is audit-logged for CMA compliance.
/// </summary>
public sealed record SaudiComplianceRequirement(string Resource) : IAuthorizationRequirement;
