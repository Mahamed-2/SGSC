using ClubOS.Application.Common.Interfaces;
using ClubOS.Application.Common.Models;
using ClubOS.Application.Features.Players.Queries;
using ClubOS.Domain.Entities;
using ClubOS.Domain.Enums;
using ClubOS.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ClubOS.Application.Features.Players.Queries;

public sealed class GetPlayersQueryHandler : IRequestHandler<GetPlayersQuery, PaginatedResult<PlayerDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public GetPlayersQueryHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<PaginatedResult<PlayerDto>> Handle(GetPlayersQuery request, CancellationToken cancellationToken)
    {
        if (request.ClubId != _tenantContext.TenantId)
             return new PaginatedResult<PlayerDto>(new List<PlayerDto>(), 0, request.Page, request.PageSize);

        var query = _context.Players
            .AsNoTracking()
            .Where(p => p.ClubId == request.ClubId && !p.IsDeleted);

        if (!string.IsNullOrWhiteSpace(request.Position) && Enum.TryParse<PlayerPosition>(request.Position, true, out var pos))
            query = query.Where(p => p.Position == pos);

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<PlayerStatus>(request.Status, true, out var status))
            query = query.Where(p => p.Status == status);

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(p => p.JerseyNumber)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new PlayerDto(
                p.Id,
                p.NameAr,
                p.NameEn,
                p.JerseyNumber,
                p.Position.ToString(),
                p.Status.ToString(),
                p.Nationality
            ))
            .ToListAsync(cancellationToken);

        return new PaginatedResult<PlayerDto>(items, total, request.Page, request.PageSize);
    }
}

public sealed class GetPlayerByIdQueryHandler : IRequestHandler<GetPlayerByIdQuery, PlayerDetailDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public GetPlayerByIdQueryHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<PlayerDetailDto?> Handle(GetPlayerByIdQuery request, CancellationToken cancellationToken)
    {
        if (request.ClubId != _tenantContext.TenantId) return null;

        var player = await _context.Players
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == request.PlayerId && p.ClubId == request.ClubId && !p.IsDeleted, cancellationToken);

        if (player is null) return null;

        var metrics = await _context.PerformanceMetrics
            .AsNoTracking()
            .Where(m => m.PlayerId == player.Id)
            .OrderByDescending(m => m.RecordedAtAST)
            .Take(10)
            .Select(m => new PerformanceMetricDto(
                m.Id,
                m.MetricType.ToString(),
                m.Value,
                m.RecordedAtAST,
                null // Title would need a join with TrainingSession if we wanted it
            ))
            .ToListAsync(cancellationToken);

        return new PlayerDetailDto(
            player.Id,
            player.NameAr,
            player.NameEn,
            player.JerseyNumber,
            player.Position.ToString(),
            player.Status.ToString(),
            player.Nationality,
            player.DateOfBirth,
            player.ContractStart,
            player.ContractEnd,
            metrics
        );
    }
}
