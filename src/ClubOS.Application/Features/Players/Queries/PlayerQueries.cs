using MediatR;
using ClubOS.Application.Common.Models;

namespace ClubOS.Application.Features.Players.Queries;

// ---------- List Players ----------
public sealed record GetPlayersQuery(
    Guid ClubId,
    string? Position = null,
    string? Status = null,
    int Page = 1,
    int PageSize = 25
) : IRequest<PaginatedResult<PlayerDto>>;

// ---------- Player Detail ----------
public sealed record GetPlayerByIdQuery(Guid ClubId, Guid PlayerId) : IRequest<PlayerDetailDto?>;

// ---------- DTOs ----------
public sealed record PlayerDto(
    Guid Id,
    string NameAr,
    string NameEn,
    int JerseyNumber,
    string Position,
    string Status,
    string Nationality
);

public sealed record PlayerDetailDto(
    Guid Id,
    string NameAr,
    string NameEn,
    int JerseyNumber,
    string Position,
    string Status,
    string Nationality,
    DateTime DateOfBirth,
    DateTime ContractStart,
    DateTime ContractEnd,
    List<PerformanceMetricDto> RecentMetrics
);

public sealed record PerformanceMetricDto(
    Guid Id,
    string MetricType,
    decimal Value,
    DateTime RecordedAtAST,
    string? TrainingSessionTitle
);
