using ClubOS.Application.Common.Interfaces;
using ClubOS.Domain.Interfaces;
using ClubOS.Infrastructure.Identity;
using ClubOS.Infrastructure.Identity.Authorization.Handlers;
using ClubOS.Infrastructure.Identity.Services;
using ClubOS.Infrastructure.Middleware;
using ClubOS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace ClubOS.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ── DATABASE ──────────────────────────────────────────────────────────
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsql => npgsql.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)
            );

            // Enable detailed errors only in non-production
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")?.Equals("Production", StringComparison.OrdinalIgnoreCase) != true)
            {
                options.EnableSensitiveDataLogging();
                options.EnableDetailedErrors();
            }
        });

        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>());

        // ── IDENTITY ──────────────────────────────────────────────────────────
        services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
        {
            options.Password.RequiredLength = 8;
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IAuthService, AuthService>();

        // ── AUTHORIZATION HANDLERS ────────────────────────────────────────────
        services.AddScoped<IAuthorizationHandler, DepartmentAccessHandler>();
        services.AddScoped<IAuthorizationHandler, TenantIsolationHandler>();
        services.AddScoped<IAuthorizationHandler, SaudiComplianceHandler>();

        // ── MULTI-TENANCY ─────────────────────────────────────────────────────
        // Scoped: one MutableTenantContext per HTTP request
        services.AddScoped<MutableTenantContext>();
        services.AddScoped<ITenantContext>(provider =>
            provider.GetRequiredService<MutableTenantContext>());

        // ── CACHING ───────────────────────────────────────────────────────────
        services.AddMemoryCache();
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
            options.InstanceName  = "clubos:";
        });

        // ── HEALTH CHECKS ─────────────────────────────────────────────────────
        services.AddHealthChecks()
            .AddNpgsql(configuration.GetConnectionString("DefaultConnection")!, "postgresql")
            .AddRedis(configuration.GetConnectionString("Redis")!, "redis");

        return services;
    }
}
