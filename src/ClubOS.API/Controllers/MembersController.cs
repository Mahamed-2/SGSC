using ClubOS.Application.Common.Models;
using ClubOS.Application.Features.Members.Commands;
using ClubOS.Application.Features.Members.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClubOS.API.Controllers;

/// <summary>
/// Members management endpoints.
/// All routes require an authenticated JWT with a valid tenant_id claim.
/// Roles follow Saudi governance pillar: SystemAdmin > TenantAdmin > AcademyManager > Coach > Staff.
/// </summary>
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
[Produces("application/json")]
public sealed class MembersController : ControllerBase
{
    private readonly IMediator _mediator;

    public MembersController(IMediator mediator) => _mediator = mediator;

    /// <summary>List members with optional filters and pagination.</summary>
    [HttpGet]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager,Coach")]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResult<MemberDto>>), 200)]
    public async Task<IActionResult> GetMembers(
        [FromQuery] Guid? academyId,
        [FromQuery] string? role,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25,
        CancellationToken ct = default)
    {
        var result = await _mediator.Send(
            new GetMembersQuery(academyId, role, status, page, pageSize), ct);
        return Ok(ApiResponse<PaginatedResult<MemberDto>>.Ok(result));
    }

    /// <summary>Get a single member by ID.</summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager,Coach")]
    [ProducesResponseType(typeof(ApiResponse<MemberDto>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetMember(Guid id, CancellationToken ct)
    {
        var member = await _mediator.Send(new GetMemberByIdQuery(id), ct);
        if (member is null)
            return NotFound(ApiResponse<MemberDto>.Fail(["Member not found / غير موجود"]));
        return Ok(ApiResponse<MemberDto>.Ok(member));
    }

    /// <summary>Enroll a new member.</summary>
    [HttpPost]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreateMember(
        [FromBody] CreateMemberCommand command,
        CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetMember), new { id },
            ApiResponse<Guid>.Ok(id, "Member enrolled successfully", "تم تسجيل العضو بنجاح"));
    }

    /// <summary>Suspend a member.</summary>
    [HttpPost("{id:guid}/suspend")]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> SuspendMember(Guid id, CancellationToken ct)
    {
        var ok = await _mediator.Send(new SuspendMemberCommand(id), ct);
        return ok ? NoContent() : NotFound();
    }

    /// <summary>Activate a suspended member.</summary>
    [HttpPost("{id:guid}/activate")]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> ActivateMember(Guid id, CancellationToken ct)
    {
        var ok = await _mediator.Send(new ActivateMemberCommand(id), ct);
        return ok ? NoContent() : NotFound();
    }
}
