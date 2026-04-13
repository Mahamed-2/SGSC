using ClubOS.Application.Common.Interfaces;
using ClubOS.Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClubOS.API.Controllers;

/// <summary>
/// Authentication and Authorization endpoints.
/// Supports granular, department-aware RBAC and refresh token flow.
/// </summary>
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary> Authenticate user and return JWT + Refresh Token. </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        try
        {
            var response = await _authService.LoginAsync(request, ct);
            return Ok(ApiResponse<AuthResponse>.Ok(response, "Login successful", "تم تسجيل الدخول بنجاح"));
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(ApiResponse<AuthResponse>.Fail(["Invalid email or password / البريد الإلكتروني أو كلمة المرور غير صحيحة"]));
        }
    }

    /// <summary> Refresh an expired access token using a refresh token. </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request, CancellationToken ct)
    {
        try
        {
            var response = await _authService.RefreshTokenAsync(request.Token, request.RefreshToken, ct);
            return Ok(ApiResponse<AuthResponse>.Ok(response));
        }
        catch (Exception)
        {
            return Unauthorized(ApiResponse<AuthResponse>.Fail(["Invalid or expired token / الرمز غير صالح أو منتهي الصلاحية"]));
        }
    }

    /// <summary> Get the current user's granular permissions for UI gating. </summary>
    [HttpGet("permissions")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserPermissionsResponse>), 200)]
    public async Task<IActionResult> GetPermissions(CancellationToken ct)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var permissions = await _authService.GetPermissionsAsync(userId, ct);
        return Ok(ApiResponse<UserPermissionsResponse>.Ok(permissions));
    }
}

public record RefreshRequest(string Token, string RefreshToken);
