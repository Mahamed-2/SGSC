using ClubOS.Application.Common.Interfaces;
using ClubOS.Domain.Entities.Identity;
using ClubOS.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ClubOS.Infrastructure.Identity.Services;

public sealed class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly IAppDbContext _context;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtService jwtService,
        IAppDbContext context,
        ILogger<AuthService> logger)
    {
        _userManager   = userManager;
        _signInManager = signInManager;
        _jwtService    = jwtService;
        _context       = context;
        _logger        = logger;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        
        if (user == null)
        {
            await LogAuditAsync(AuditLog.LoginFailed(request.Email, null, "User not found", null, null, null));
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!result.Succeeded)
        {
            await LogAuditAsync(AuditLog.LoginFailed(request.Email, user.ClubId, "Invalid password", null, null, null));
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        // Update last login AST
        user.LastLoginAST = user.GetCurrentAST();
        await _userManager.UpdateAsync(user);

        // Fetch roles and departments
        var roles = await _userManager.GetRolesAsync(user);
        var primaryRole = roles.FirstOrDefault() ?? "Viewer";
        var departments = await _context.UserDepartments
            .Where(ud => ud.UserId == user.Id)
            .Select(ud => ud.Department.Code)
            .ToListAsync(ct);

        var token = _jwtService.GenerateAccessToken(user.Id, user.Email!, user.ClubId, primaryRole, departments);
        var refreshToken = _jwtService.GenerateRefreshToken();

        // Audit success
        await LogAuditAsync(AuditLog.LoginSuccess(user.Id, user.Email!, user.ClubId, null, null, null));

        return new AuthResponse(token, refreshToken, DateTime.UtcNow.AddHours(1));
    }

    public async Task<AuthResponse> RefreshTokenAsync(string token, string refreshToken, CancellationToken ct = default)
    {
        var principal = _jwtService.GetPrincipalFromExpiredToken(token);
        var userId = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userId == null) throw new UnauthorizedAccessException("Invalid token");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) throw new UnauthorizedAccessException("User not found");

        var roles = await _userManager.GetRolesAsync(user);
        var departments = await _context.UserDepartments
            .Where(ud => ud.UserId == user.Id)
            .Select(ud => ud.Department.Code)
            .ToListAsync(ct);

        var newToken = _jwtService.GenerateAccessToken(user.Id, user.Email!, user.ClubId, roles.FirstOrDefault() ?? "Viewer", departments);
        
        await LogAuditAsync(AuditLog.TokenRefreshed(user.Id, user.ClubId, null, null));

        return new AuthResponse(newToken, refreshToken, DateTime.UtcNow.AddHours(1));
    }

    public async Task<UserPermissionsResponse> GetPermissionsAsync(string userId, CancellationToken ct = default)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return new UserPermissionsResponse(new List<string>());

        var roles = await _userManager.GetRolesAsync(user);
        
        // Get all permission keys for these roles
        var permissionKeys = await _context.RolePermissions
            .Where(rp => roles.Contains(rp.RoleId))
            .Select(rp => rp.Permission.Key)
            .Distinct()
            .ToListAsync(ct);

        return new UserPermissionsResponse(permissionKeys);
    }

    private async Task LogAuditAsync(AuditLog log)
    {
        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();
    }
}
