using ClubOS.Application.Common.Behaviors;
using ClubOS.Application.Common.Interfaces;
using ClubOS.Application.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ClubOS.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // ── KPI ENGINE ────────────────────────────────────────────────────────
        services.AddScoped<KpiService>(); // Concrete implementation
        services.AddScoped<IKpiService>(provider => 
        {
            var inner = provider.GetRequiredService<KpiService>();
            var cache = provider.GetRequiredService<Microsoft.Extensions.Caching.Distributed.IDistributedCache>();
            return new CachedKpiService(inner, cache);
        });

        return services;
    }
}
