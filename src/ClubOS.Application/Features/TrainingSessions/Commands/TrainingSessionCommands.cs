using MediatR;

namespace ClubOS.Application.Features.TrainingSessions.Commands;

// ---------- Schedule Session ----------
public sealed record CreateTrainingSessionCommand(
    Guid ClubId,
    Guid DepartmentId,
    string Title,
    DateTime DateTimeAST,
    int DurationMinutes,
    string Location,
    Guid CoachId
) : IRequest<Guid>;
