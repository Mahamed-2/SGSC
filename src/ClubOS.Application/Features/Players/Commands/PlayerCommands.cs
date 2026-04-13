using MediatR;

namespace ClubOS.Application.Features.Players.Commands;

// ---------- Create Player ----------
public sealed record CreatePlayerCommand(
    Guid ClubId,
    string NameAr,
    string NameEn,
    int JerseyNumber,
    string Position,
    DateTime DateOfBirth,
    string Nationality,
    DateTime ContractStart,
    DateTime ContractEnd,
    string Status
) : IRequest<Guid>;

// ---------- Update Player ----------
public sealed record UpdatePlayerCommand(
    Guid ClubId,
    Guid PlayerId,
    string NameAr,
    string NameEn,
    int JerseyNumber,
    string Position,
    string Status,
    DateTime ContractEnd
) : IRequest<bool>;
