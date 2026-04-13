using ClubOS.Application.Common.Interfaces;
using ClubOS.Application.Features.TrainingSessions.Queries;
using ClubOS.Application.Features.TrainingSessions.Commands;
using ClubOS.Domain.Entities;
using ClubOS.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ClubOS.Application.Features.TrainingSessions.Queries;

public sealed class GetTrainingSessionsQueryHandler : IRequestHandler<GetTrainingSessionsQuery, List<TrainingSessionDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public GetTrainingSessionsQueryHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<List<TrainingSessionDto>> Handle(GetTrainingSessionsQuery request, CancellationToken cancellationToken)
    {
        if (request.ClubId != _tenantContext.TenantId) return new List<TrainingSessionDto>();

        var sessions = await _context.TrainingSessions
            .AsNoTracking()
            .Where(s => s.ClubId == request.ClubId && s.DateTimeAST >= request.StartDate && s.DateTimeAST <= request.EndDate && !s.IsDeleted)
            .OrderBy(s => s.DateTimeAST)
            .Select(s => new TrainingSessionDto(
                s.Id,
                s.Title,
                s.DateTimeAST,
                s.DurationMinutes,
                s.Location,
                s.CoachId,
                "Coach Name Placeholder", // Ideally join with Staff table
                s.AttendedPlayerIds.Count
            ))
            .ToListAsync(cancellationToken);

        return sessions;
    }
}

public sealed class CreateTrainingSessionCommandHandler : IRequestHandler<CreateTrainingSessionCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public CreateTrainingSessionCommandHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<Guid> Handle(CreateTrainingSessionCommand request, CancellationToken cancellationToken)
    {
        if (request.ClubId != _tenantContext.TenantId)
            throw new UnauthorizedAccessException("Club ID mismatch.");

        var session = TrainingSession.Create(
            request.ClubId,
            request.DepartmentId,
            request.Title,
            request.DateTimeAST,
            request.DurationMinutes,
            request.Location,
            request.CoachId
        );

        _context.TrainingSessions.Add(session);
        await _context.SaveChangesAsync(cancellationToken);
        return session.Id;
    }
}
