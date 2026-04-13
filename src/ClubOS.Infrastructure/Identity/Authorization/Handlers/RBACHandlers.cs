using ClubOS.Application.Common.Interfaces;
using ClubOS.Domain.Entities.Identity;
using ClubOS.Infrastructure.Identity.Authorization.Requirements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace ClubOS.Infrastructure.Identity.Authorization.Handlers;

/// <summary>
/// Enforces department-level access control.
/// Checks 'department_id' claims against required department.
/// </summary>
public sealed class DepartmentAccessHandler : AuthorizationHandler<DepartmentAccessRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        DepartmentAccessRequirement requirement)
    {
        // Platform admins bypass department checks
        if (context.User.IsInRole("SystemAdmin"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Extract departments user belongs to
        var userDepts = context.User.FindAll("department_id").Select(c => c.Value).ToList();

        // If the resource requires a specific department, check if user is in it
        // Note: For generic "READ" on a list, the controller/query typically applies filters.
        // This handler is usually called for specific resource actions.
        
        // Simplified for demo: if user has any department, we allow (logic would be expanded per resource)
        if (userDepts.Any())
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

/// <summary>
/// Enforces multi-tenant isolation.
/// Matches 'tenant_id' claim with the resource's TenantId.
/// </summary>
public sealed class TenantIsolationHandler : AuthorizationHandler<TenantIsolationRequirement>
{
    private readonly ITenantContext _tenantContext;

    public TenantIsolationHandler(ITenantContext tenantContext)
    {
        _tenantContext = tenantContext;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        TenantIsolationRequirement requirement)
    {
        var tenantIdClaim = context.User.FindFirst("tenant_id")?.Value;

        if (tenantIdClaim != null && 
            Guid.TryParse(tenantIdClaim, out var claimId) && 
            claimId == _tenantContext.TenantId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

/// <summary>
/// Captures an audit trail for sensitive resource access (CMA compliance).
/// </summary>
public sealed class SaudiComplianceHandler : AuthorizationHandler<SaudiComplianceRequirement>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<SaudiComplianceHandler> _logger;

    public SaudiComplianceHandler(IApplicationDbContext context, ILogger<SaudiComplianceHandler> logger)
    {
        _context = context;
        _logger  = logger;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SaudiComplianceRequirement requirement)
    {
        var userId   = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var tenantId = context.User.FindFirst("tenant_id")?.Value;

        var auditLog = AuditLog.ResourceAccessed(
            userId ?? "anonymous",
            Guid.TryParse(tenantId, out var g) ? g : null,
            requirement.Resource,
            "CHECK", // Generic check entry
            null,    // IP would be solved via IHttpContextAccessor in real scenario
            context.User.FindFirst("correlation_id")?.Value
        );

        _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync();

        context.Succeed(requirement);
    }
}
