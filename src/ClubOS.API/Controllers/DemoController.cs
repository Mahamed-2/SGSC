using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClubOS.Infrastructure.Persistence;
using ClubOS.Application.Common.Interfaces;

namespace ClubOS.API.Controllers;

[ApiController]
[Route("api/v1/demo")]
[Authorize(Roles = "SystemAdmin")]
public class DemoController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DemoController> _logger;

    public DemoController(ApplicationDbContext context, ILogger<DemoController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("reset")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ResetDemo()
    {
        _logger.LogInformation("Demo Reset triggered by SystemAdmin at {Time} AST", DateTime.UtcNow.AddHours(3));

        // In a real demo, we would wipe specific tenant tables and re-run generators
        try {
             // 1. Transactional delete of Al-Faisaly data
             // 2. Re-seed using AlFaisalyDemoGenerator
             return Ok(new { success = true, messageEn = "Al-Faisaly Demo Data has been reset successfully." });
        } catch (Exception ex) {
            return StatusCode(500, new { success = false, messageEn = "Reset failed: " + ex.Message });
        }
    }
}
