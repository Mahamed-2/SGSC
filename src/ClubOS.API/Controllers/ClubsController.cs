using ClubOS.Application.Common.Models;
using ClubOS.Application.Features.Clubs.Queries;
using ClubOS.Application.Features.Players.Commands;
using ClubOS.Application.Features.Players.Queries;
using ClubOS.Application.Features.TrainingSessions.Commands;
using ClubOS.Application.Features.TrainingSessions.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClubOS.API.Controllers;

/// <summary>
/// Core Club management APIs.
/// Provides versioned access to departments, players, and training schedules.
/// </summary>
[ApiController]
[Route("api/v{version:apiVersion}/clubs/{id:guid}")]
[Authorize]
[Produces("application/json")]
public sealed class ClubsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ClubsController(IMediator mediator) => _mediator = mediator;

    /// <summary>List departments for a given club (tenant).</summary>
    /// <response code="200">العودة بقائمة الأقسام بنجاح</response>
    [HttpGet("departments")]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager,Coach")]
    [ProducesResponseType(typeof(ApiResponse<List<DepartmentDto>>), 200)]
    public async Task<IActionResult> GetDepartments(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetClubDepartmentsQuery(id), ct);
        return Ok(ApiResponse<List<DepartmentDto>>.Ok(result));
    }

    /// <summary>List players with position and status filters.</summary>
    /// <response code="200">العودة بقائمة اللاعبين مع التصفية</response>
    [HttpGet("players")]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager,Coach,MedicalStaff,Scout")]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResult<PlayerDto>>), 200)]
    public async Task<IActionResult> GetPlayers(
        Guid id,
        [FromQuery] string? position,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25,
        CancellationToken ct = default)
    {
        var result = await _mediator.Send(new GetPlayersQuery(id, position, status, page, pageSize), ct);
        return Ok(ApiResponse<PaginatedResult<PlayerDto>>.Ok(result));
    }

    /// <summary>Create a new player record.</summary>
    /// <response code="201">تم إنشاء ملف اللاعب بنجاح</response>
    [HttpPost("players")]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), 201)]
    public async Task<IActionResult> CreatePlayer(Guid id, [FromBody] CreatePlayerCommand command, CancellationToken ct)
    {
        // Enforce URL consistency with body
        if (id != command.ClubId) return BadRequest(ApiResponse<Guid>.Fail(["Club ID mismatch"]));
        
        var playerId = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetPlayer), new { id, playerId }, ApiResponse<Guid>.Ok(playerId));
    }

    /// <summary>Get player detail with performance metrics history.</summary>
    /// <response code="200">العودة بتفاصيل اللاعب وتاريخ الأداء</response>
    [HttpGet("players/{playerId:guid}")]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager,Coach,MedicalStaff")]
    [ProducesResponseType(typeof(ApiResponse<PlayerDetailDto>), 200)]
    public async Task<IActionResult> GetPlayer(Guid id, Guid playerId, CancellationToken ct)
    {
        var player = await _mediator.Send(new GetPlayerByIdQuery(id, playerId), ct);
        if (player is null) return NotFound();
        return Ok(ApiResponse<PlayerDetailDto>.Ok(player));
    }

    /// <summary>Update an existing player record.</summary>
    /// <response code="204">تم تحديث بيانات اللاعب بنجاح</response>
    [HttpPut("players/{playerId:guid}")]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> UpdatePlayer(Guid id, Guid playerId, [FromBody] UpdatePlayerCommand command, CancellationToken ct)
    {
        if (id != command.ClubId || playerId != command.PlayerId) return BadRequest();
        var ok = await _mediator.Send(command, ct);
        return ok ? NoContent() : NotFound();
    }

    /// <summary>Get training sessions calendar view for a date range.</summary>
    /// <response code="200">منظور التقويم للتمارين الرياضية</response>
    [HttpGet("training-sessions")]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager,Coach,MedicalStaff")]
    [ProducesResponseType(typeof(ApiResponse<List<TrainingSessionDto>>), 200)]
    public async Task<IActionResult> GetTrainingSessions(Guid id, [FromQuery] DateTime start, [FromQuery] DateTime end, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetTrainingSessionsQuery(id, start, end), ct);
        return Ok(ApiResponse<List<TrainingSessionDto>>.Ok(result));
    }

    /// <summary>Schedule a new training session.</summary>
    /// <response code="201">تم جدولة التمرين بنجاح</response>
    [HttpPost("training-sessions")]
    [Authorize(Roles = "SystemAdmin,TenantAdmin,AcademyManager,Coach")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), 201)]
    public async Task<IActionResult> CreateSession(Guid id, [FromBody] CreateTrainingSessionCommand command, CancellationToken ct)
    {
        if (id != command.ClubId) return BadRequest();
        var sessionId = await _mediator.Send(command, ct);
        return Created(string.Empty, ApiResponse<Guid>.Ok(sessionId));
    }
}
