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
[Route("api/v1/clubs/{clubId}/medical")]
public class MedicalController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public MedicalController(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    [HttpGet("injury-reports")]
    public async Task<ActionResult<ApiResponse<List<InjuryReport>>>> GetInjuryReports(Guid clubId)
    {
        if (clubId != _tenantContext.TenantId) return Forbid();

        var reports = await _context.InjuryReports
            .AsNoTracking()
            .OrderByDescending(r => r.OccurredAt)
            .ToListAsync();

        return Ok(ApiResponse<List<InjuryReport>>.SuccessResponse(reports));
    }

    [HttpGet("fitness-tests")]
    public async Task<ActionResult<ApiResponse<List<FitnessTest>>>> GetFitnessTests(Guid clubId)
    {
        if (clubId != _tenantContext.TenantId) return Forbid();

        var tests = await _context.FitnessTests
            .AsNoTracking()
            .OrderByDescending(t => t.TestedAt)
            .ToListAsync();

        return Ok(ApiResponse<List<FitnessTest>>.SuccessResponse(tests));
    }
}

[Authorize]
[ApiController]
[Route("api/v1/clubs/{clubId}/finance")]
public class FinanceController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public FinanceController(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    [HttpGet("budget")]
    public async Task<ActionResult<ApiResponse<List<BudgetItem>>>> GetBudget(Guid clubId, [FromQuery] int year)
    {
        if (clubId != _tenantContext.TenantId) return Forbid();

        var budget = await _context.BudgetItems
            .AsNoTracking()
            .Where(b => b.FiscalYear == year)
            .ToListAsync();

        return Ok(ApiResponse<List<BudgetItem>>.SuccessResponse(budget));
    }

    [HttpGet("contracts")]
    public async Task<ActionResult<ApiResponse<List<SponsorshipContract>>>> GetContracts(Guid clubId)
    {
        if (clubId != _tenantContext.TenantId) return Forbid();

        var contracts = await _context.SponsorshipContracts
            .AsNoTracking()
            .ToListAsync();

        return Ok(ApiResponse<List<SponsorshipContract>>.SuccessResponse(contracts));
    }
}

[Authorize]
[ApiController]
[Route("api/v1/clubs/{clubId}/hr")]
public class HrController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public HrController(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    [HttpGet("staff-profiles")]
    public async Task<ActionResult<ApiResponse<List<StaffProfile>>>> GetStaffProfiles(Guid clubId)
    {
        if (clubId != _tenantContext.TenantId) return Forbid();

        var profiles = await _context.StaffProfiles
            .AsNoTracking()
            .ToListAsync();

        return Ok(ApiResponse<List<StaffProfile>>.SuccessResponse(profiles));
    }
}
