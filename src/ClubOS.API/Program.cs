using ClubOS.API.Middleware;
using ClubOS.Application;
using ClubOS.Infrastructure;
using ClubOS.Infrastructure.Identity.Authorization.Requirements;
using ClubOS.Infrastructure.Middleware;
using ClubOS.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using System.Globalization;
using System.Text;

namespace ClubOS.API;

// ── BOOTSTRAP SERILOG ─────────────────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "ClubOS")
    .Enrich.WithProperty("Environment", Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production")
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .WriteTo.File("logs/clubos-.log", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 30)
    .CreateLogger();

try
{
    Log.Information("Starting ClubOS API – Saudi Standard Time (UTC+3)");

    var builder = WebApplication.CreateBuilder(args);
    builder.Host.UseSerilog();

    // ── CONFIGURATION ─────────────────────────────────────────────────────────
    builder.Configuration
        .AddJsonFile("appsettings.json", optional: false)
        .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
        .AddEnvironmentVariables(); // overrides for Azure App Service / Docker

    // ── SERVICES ──────────────────────────────────────────────────────────────
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    // Controllers
    builder.Services.AddControllers()
        .AddJsonOptions(opts =>
        {
            opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        });

    // API Versioning
    builder.Services.AddApiVersioning(opts =>
    {
        opts.DefaultApiVersion = new ApiVersion(1, 0);
        opts.AssumeDefaultVersionWhenUnspecified = true;
        opts.ReportApiVersions = true;
    }).AddApiExplorer(opts =>
    {
        opts.GroupNameFormat           = "'v'VVV";
        opts.SubstituteApiVersionInUrl = true;
    });

    // Localization: Arabic (ar-SA) primary, English (en-US) fallback
    builder.Services.AddLocalization(opts => opts.ResourcesPath = "Resources");
    builder.Services.Configure<RequestLocalizationOptions>(opts =>
    {
        var supported = new[] { new CultureInfo("ar-SA"), new CultureInfo("en-US") };
        opts.DefaultRequestCulture = new RequestCulture("ar-SA");
        opts.SupportedCultures     = supported;
        opts.SupportedUICultures   = supported;
        opts.RequestCultureProviders = new[]
        {
            new AcceptLanguageHeaderRequestCultureProvider(),
            new QueryStringRequestCultureProvider()   // ?culture=en-US for testing
        };
    });

    // JWT Authentication
    var jwtSection = builder.Configuration.GetSection("Jwt");
    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(opts =>
        {
            opts.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer           = true,
                ValidateAudience         = true,
                ValidateLifetime         = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer              = jwtSection["Issuer"],
                ValidAudience            = jwtSection["Audience"],
                IssuerSigningKey         = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtSection["SecretKey"]!)),
                ClockSkew = TimeSpan.FromSeconds(30)
            };
            opts.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = ctx =>
                {
                    Log.Warning("JWT auth failed: {Error}", ctx.Exception.Message);
                    return Task.CompletedTask;
                }
            };
        });

    // Authorization – Saudi governance & granular RBAC
    builder.Services.AddAuthorizationBuilder()
        .AddPolicy("TenantPolicy",    p => p.RequireClaim("tenant_id"))
        .AddPolicy("AdminOnly",       p => p.RequireRole("SystemAdmin"))
        
        // Granular Department Access
        .AddPolicy("MedicalDeptAccess", p => p.AddRequirements(
            new DepartmentAccessRequirement("MEDICAL", "READ"),
            new TenantIsolationRequirement(),
            new SaudiComplianceRequirement("MedicalRecords")))
            
        .AddPolicy("FinanceDeptAccess", p => p.AddRequirements(
            new DepartmentAccessRequirement("FINANCE", "READ"),
            new TenantIsolationRequirement(),
            new SaudiComplianceRequirement("FinancialData")))

        .AddPolicy("TenantIsolationOnly", p => p.AddRequirements(new TenantIsolationRequirement()))
        
        .AddPolicy("TenantAdminOnly", p => p.RequireRole("SystemAdmin", "TenantAdmin"))
        .AddPolicy("ManagerOrAbove",  p => p.RequireRole("SystemAdmin", "TenantAdmin", "AcademyManager"))
        .AddPolicy("FeedbackReview",  p => p.RequireRole("SystemAdmin", "TenantAdmin", "AcademyManager"));

    // CORS – Allow Next.js frontend (adjust for prod)
    builder.Services.AddCors(opts => opts.AddPolicy("FrontendPolicy", policy =>
        policy
            .WithOrigins(
                builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
                ?? ["http://localhost:3000"])
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()));

    // Swagger
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title       = "ClubOS API",
            Version     = "v1",
            Description = "Multi-tenant B2B SaaS for Saudi sports academies | نظام إدارة الأكاديميات الرياضية",
            Contact     = new OpenApiContact { Name = "ClubOS Team", Email = "support@clubos.sa" }
        });
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Type         = SecuritySchemeType.Http,
            Scheme       = "bearer",
            BearerFormat = "JWT",
            Description  = "Enter JWT token"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            [new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            }] = []
        });
    });

    // Global error handling
    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddProblemDetails();

    // ── BUILD APP ─────────────────────────────────────────────────────────────
    var app = builder.Build();

    // ── MIDDLEWARE PIPELINE ───────────────────────────────────────────────────
    app.UseExceptionHandler();
    app.UseRequestLocalization();

    if (!app.Environment.IsProduction())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "ClubOS API v1");
            c.RoutePrefix = string.Empty; // Swagger at root in Dev
        });
    }

    app.UseHttpsRedirection();
    app.UseCors("FrontendPolicy");
    app.UseSerilogRequestLogging(opts =>
    {
        opts.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    });
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseTenantContext();            // 👈 Must be AFTER UseAuthentication

    app.MapControllers();
    app.MapHealthChecks("/health");

    // ── AUTO-MIGRATE ON DEV ───────────────────────────────────────────────────
    if (app.Environment.IsDevelopment())
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ClubOS.Infrastructure.Persistence.ApplicationDbContext>();
        await db.Database.MigrateAsync();
    }

    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "ClubOS API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
