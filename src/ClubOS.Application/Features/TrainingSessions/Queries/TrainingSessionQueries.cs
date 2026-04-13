using MediatR;
using ClubOS.Application.Common.Models;

namespace ClubOS.Application.Features.TrainingSessions.Queries;

// ---------- List Sessions ----------
public sealed record GetTrainingSessionsQuery(
    Guid ClubId,
    DateTime StartDate,
    DateTime EndDate
) : IRequest<List<TrainingSessionDto>>;

// ---------- DTO ----------
public sealed record TrainingSessionDto(
    Guid Id,
    string Title,
    DateTime DateTimeAST,
    int DurationMinutes,
    string Location,
    Guid CoachId,
    string CoachName,
    int AttendanceCount
);
