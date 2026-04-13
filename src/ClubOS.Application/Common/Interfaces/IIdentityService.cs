namespace ClubOS.Application.Common.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<AuthResponse> RefreshTokenAsync(string token, string refreshToken, CancellationToken ct = default);
    Task<UserPermissionsResponse> GetPermissionsAsync(string userId, CancellationToken ct = default);
}

public interface IJwtService
{
    string GenerateAccessToken(string userId, string email, Guid tenantId, string role, IEnumerable<string> departments);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}

public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, string RefreshToken, DateTime Expiry);
public record UserPermissionsResponse(IReadOnlyList<string> Permissions);
