using ClubOS.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ClubOS.Infrastructure.Middleware;

/// <summary>
/// Resolves the current tenant from the authenticated JWT.
/// Placed early in the middleware pipeline, after authentication.
/// The TenantId claim is SET by the identity provider and is NEVER trust
/// from the query string or request body.
/// </summary>
public sealed class TenantContextMiddleware
{
    private readonly RequestDelegate _next;

    public TenantContextMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, ITenantContext tenantContext)
    {
        // Health checks and public endpoints can bypass tenant resolution
        if (context.Request.Path.StartsWithSegments("/health") ||
            context.Request.Path.StartsWithSegments("/metrics"))
        {
            await _next(context);
            return;
        }

        if (tenantContext is MutableTenantContext mutable)
        {
            // Primary source: JWT claim "tenant_id"
            var tenantIdClaim = context.User.FindFirstValue("tenant_id");
            if (Guid.TryParse(tenantIdClaim, out var tenantId))
            {
                mutable.SetTenant(tenantId, context.User.FindFirstValue("tenant_slug"));
            }
            else if (context.User.Identity?.IsAuthenticated == true)
            {
                // Authenticated but missing claim → reject
                context.Response.StatusCode = 403;
                await context.Response.WriteAsJsonAsync(new
                {
                    error = "Missing tenant_id claim. Contact your administrator.",
                    code  = "MISSING_TENANT_CLAIM"
                });
                return;
            }
        }

        await _next(context);
    }
}

/// <summary>
/// Scoped service holding the resolved tenant for the current request.
/// Infrastructure registers this as the ITenantContext implementation.
/// </summary>
public sealed class MutableTenantContext : ITenantContext
{
    public Guid TenantId { get; private set; }
    public string? TenantSlug { get; private set; }
    public bool IsResolved { get; private set; }

    public void SetTenant(Guid tenantId, string? slug)
    {
        TenantId   = tenantId;
        TenantSlug = slug;
        IsResolved = true;
    }
}

/// <summary>Extension method to register the middleware cleanly.</summary>
public static class TenantContextExtensions
{
    public static IApplicationBuilder UseTenantContext(this IApplicationBuilder app)
        => app.UseMiddleware<TenantContextMiddleware>();
}
