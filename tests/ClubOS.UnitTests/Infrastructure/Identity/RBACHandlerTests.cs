using ClubOS.Infrastructure.Identity.Authorization.Handlers;
using ClubOS.Infrastructure.Identity.Authorization.Requirements;
using Microsoft.AspNetCore.Authorization;
using Moq;
using System.Security.Claims;
using Xunit;

namespace ClubOS.UnitTests.Infrastructure.Identity;

public sealed class DepartmentAccessHandlerTests
{
    private readonly DepartmentAccessHandler _handler;

    public DepartmentAccessHandlerTests()
    {
        _handler = new DepartmentAccessHandler();
    }

    [Fact]
    public async Task HandleAsync_ShouldSucceed_WhenUserIsSystemAdmin()
    {
        // Arrange
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Role, "SystemAdmin")
        }, "TestAuth"));

        var requirement = new DepartmentAccessRequirement("MEDICAL", "READ");
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task HandleAsync_ShouldSucceed_WhenUserHasCorrectDepartmentClaim()
    {
        // Arrange
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Role, "Coach"),
            new Claim("department_id", "MEDICAL")
        }, "TestAuth"));

        var requirement = new DepartmentAccessRequirement("MEDICAL", "READ");
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task HandleAsync_ShouldNotSucceed_WhenUserLacksDepartmentClaim()
    {
        // Arrange
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Role, "Coach")
        }, "TestAuth"));

        var requirement = new DepartmentAccessRequirement("MEDICAL", "READ");
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }
}

public sealed class TenantIsolationHandlerTests
{
    private readonly Mock<ClubOS.Application.Common.Interfaces.ITenantContext> _mockTenantContext;
    private readonly TenantIsolationHandler _handler;

    public TenantIsolationHandlerTests()
    {
        _mockTenantContext = new Mock<ClubOS.Application.Common.Interfaces.ITenantContext>();
        _handler = new TenantIsolationHandler(_mockTenantContext.Object);
    }

    [Fact]
    public async Task HandleAsync_ShouldSucceed_WhenTenantIdMatches()
    {
        // Arrange
        var tenantId = Guid.NewGuid();
        _mockTenantContext.Setup(t => t.TenantId).Returns(tenantId);

        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim("tenant_id", tenantId.ToString())
        }, "TestAuth"));

        var requirement = new TenantIsolationRequirement();
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
    }

    [Fact]
    public async Task HandleAsync_ShouldNotSucceed_WhenTenantIdDoesNotMatch()
    {
        // Arrange
        var tenantId = Guid.NewGuid();
        var differentTenantId = Guid.NewGuid();
        _mockTenantContext.Setup(t => t.TenantId).Returns(tenantId);

        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim("tenant_id", differentTenantId.ToString())
        }, "TestAuth"));

        var requirement = new TenantIsolationRequirement();
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.False(context.HasSucceeded);
    }
}

public sealed class SaudiComplianceHandlerTests
{
    private readonly Mock<ClubOS.Application.Common.Interfaces.IApplicationDbContext> _mockContext;
    private readonly Mock<Microsoft.Extensions.Logging.ILogger<SaudiComplianceHandler>> _mockLogger;
    private readonly SaudiComplianceHandler _handler;

    public SaudiComplianceHandlerTests()
    {
        _mockContext = new Mock<ClubOS.Application.Common.Interfaces.IApplicationDbContext>();
        _mockLogger = new Mock<Microsoft.Extensions.Logging.ILogger<SaudiComplianceHandler>>();
        var mockAuditLogs = new Mock<Microsoft.EntityFrameworkCore.DbSet<ClubOS.Domain.Entities.Identity.AuditLog>>();
        _mockContext.Setup(c => c.AuditLogs).Returns(mockAuditLogs.Object);

        _handler = new SaudiComplianceHandler(_mockContext.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task HandleAsync_ShouldLogAuditAndSucceed()
    {
        // Arrange
        var tenantId = Guid.NewGuid();
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "user123"),
            new Claim("tenant_id", tenantId.ToString())
        }, "TestAuth"));

        var requirement = new SaudiComplianceRequirement("MedicalRecords");
        var context = new AuthorizationHandlerContext(new[] { requirement }, user, null);

        // Act
        await _handler.HandleAsync(context);

        // Assert
        Assert.True(context.HasSucceeded);
        _mockContext.Verify(c => c.AuditLogs.Add(It.IsAny<ClubOS.Domain.Entities.Identity.AuditLog>()), Times.Once);
        _mockContext.Verify(c => c.SaveChangesAsync(default), Times.Once);
    }
}
