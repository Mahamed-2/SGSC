using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities;

public sealed class TrainingSession : BaseEntity, ITenantEntity
{
    private TrainingSession() { }

    public Guid ClubId { get; set; }
    public Guid DepartmentId { get; private set; } // Which dept owns the session
    
    public string Title { get; private set; } = default!;
    public DateTime DateTimeAST { get; private set; } // Arab Standard Time directly saved
    
    public int DurationMinutes { get; private set; }
    public string Location { get; private set; } = default!;
    
    public Guid CoachId { get; private set; } // Reins to a Staff entity
    
    // Simplistic array to store attended PlayerIds
    public List<Guid> AttendedPlayerIds { get; private set; } = new();

    public static TrainingSession Create(Guid clubId, Guid deptId, string title, DateTime dtAst, int duration, string location, Guid coachId)
    {
        return new TrainingSession
        {
            ClubId = clubId,
            DepartmentId = deptId,
            Title = title,
            DateTimeAST = dtAst,
            DurationMinutes = duration,
            Location = location,
            CoachId = coachId
        };
    }
}
