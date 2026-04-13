using ClubOS.Application.Common.Models;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ClubOS.API.Middleware;

/// <summary>
/// Global exception handler using .NET 8+ IExceptionHandler approach.
/// Returns Problem Details (RFC 7807) with bilingual messages.
/// </summary>
public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        => _logger = logger;

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var traceId = httpContext.TraceIdentifier;

        _logger.LogError(exception,
            "Unhandled exception. TraceId: {TraceId}", traceId);

        var (statusCode, title, detail) = exception switch
        {
            ValidationException ve => (
                StatusCodes.Status400BadRequest,
                "Validation Failed / فشل التحقق",
                string.Join("; ", ve.Errors.Select(e => e.ErrorMessage))
            ),
            Domain.Exceptions.TenantAccessViolationException => (
                StatusCodes.Status403Forbidden,
                "Access Denied / تم رفض الوصول",
                "You do not have access to this resource. / ليس لديك صلاحية الوصول."
            ),
            Domain.Exceptions.DomainException de => (
                StatusCodes.Status422UnprocessableEntity,
                de.Code,
                de.Message
            ),
            _ => (
                StatusCodes.Status500InternalServerError,
                "Internal Server Error / خطأ داخلي في الخادم",
                "An unexpected error occurred. Please try again. / حدث خطأ غير متوقع."
            )
        };

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(new
        {
            type     = "https://clubos.sa/errors/" + statusCode,
            title,
            status   = statusCode,
            detail,
            traceId,
            errors   = exception is ValidationException vex
                ? vex.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage })
                : null
        }, cancellationToken);

        return true;
    }
}
