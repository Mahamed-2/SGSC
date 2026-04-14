using ClubOS.Application.Common.Interfaces;
using ClubOS.Application.Common.Models;
using ClubOS.Domain.Entities;
using ClubOS.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClubOS.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/clubs/{clubId}/football")]
public class FootballController : ControllerBase
{
    private readonly IAppDbContext _context;
    private readonly ITenantContext _tenantContext;

    public FootballController(IAppDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    [HttpGet("drills")]
    public async Task<ActionResult<ApiResponse<List<FootballDrill>>>> GetDrills(Guid clubId)
    {
        if (clubId != _tenantContext.TenantId) return Forbid();

        var drills = await _context.FootballDrills
            .AsNoTracking()
            .ToListAsync();

        return Ok(ApiResponse<List<FootballDrill>>.Ok(drills));
    }

    [HttpGet("match-plans")]
    public async Task<ActionResult<ApiResponse<List<MatchPlan>>>> GetMatchPlans(Guid clubId)
    {
        if (clubId != _tenantContext.TenantId) return Forbid();

        var plans = await _context.MatchPlans
            .AsNoTracking()
            .OrderByDescending(p => p.MatchDateAST)
            .ToListAsync();

        return Ok(ApiResponse<List<MatchPlan>>.Ok(plans));
    }

    [HttpPost("match-plans")]
    public async Task<ActionResult<ApiResponse<Guid>>> CreateMatchPlan(Guid clubId, [FromBody] MatchPlan plan)
    {
        if (clubId != _tenantContext.TenantId) return Forbid();

        _context.MatchPlans.Add(plan);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<Guid>.Ok(plan.Id));
    }
}
