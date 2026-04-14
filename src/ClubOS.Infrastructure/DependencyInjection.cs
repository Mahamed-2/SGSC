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
using Npgsql;

namespace ClubOS.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ── DATABASE ──────────────────────────────────────────────────────────
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddNpgsqlDataSource(connectionString!);

        services.AddDbContext<AppDbContext>((sp, options) =>
        {
            options.UseNpgsql(
                sp.GetRequiredService<NpgsqlDataSource>(),
                npgsql => npgsql.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)
            );

            // Enable detailed errors only in non-production
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")?.Equals("Production", StringComparison.OrdinalIgnoreCase) != true)
            {
                options.EnableSensitiveDataLogging();
                options.EnableDetailedErrors();
            }
        });

        services.AddScoped<IAppDbContext>(provider =>
            provider.GetRequiredService<AppDbContext>());

        // ── IDENTITY ──────────────────────────────────────────────────────────
        services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
        {
            options.Password.RequiredLength = 8;
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<AppDbContext>()
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
            .AddTypeActivatedCheck<NpgsqlDataSourceHealthCheck>("postgresql")
            .AddRedis(redisConnectionString: configuration.GetConnectionString("Redis")!, name: "redis");
        
        return services;
    }
}

/// <summary>
/// Explicit HealthCheck implementation to avoid API naming collisions in .NET 10
/// </summary>
internal sealed class NpgsqlDataSourceHealthCheck : IHealthCheck
{
    private readonly NpgsqlDataSource _dataSource;
    public NpgsqlDataSourceHealthCheck(NpgsqlDataSource dataSource) => _dataSource = dataSource;

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {
            await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
            await using var command    = connection.CreateCommand();
            command.CommandText        = "SELECT 1";
            await command.ExecuteScalarAsync(cancellationToken);
            return HealthCheckResult.Healthy();
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy(exception: ex);
        }
    }
}
