using ClubOS.Domain.Common;
using ClubOS.Domain.Enums;

namespace ClubOS.Domain.Entities;

public sealed class Player : BaseEntity, ITenantEntity
{
    private Player() { }

    public Guid ClubId { get; set; }
    
    public string NameAr { get; private set; } = default!;
    public string NameEn { get; private set; } = default!;
    
    public int JerseyNumber { get; private set; }
    public PlayerPosition Position { get; private set; }
    
    public DateTime DateOfBirth { get; private set; }
    public string Nationality { get; private set; } = "SA"; // Saudi Default
    
    public DateTime ContractStart { get; private set; }
    public DateTime ContractEnd { get; private set; }
    
    public PlayerStatus Status { get; private set; }

    // Navigation
    public ICollection<PerformanceMetric> Metrics { get; private set; } = new List<PerformanceMetric>();

    public static Player Create(Guid clubId, string nameAr, string nameEn, int jersey, PlayerPosition pos, DateTime dob, string nat, DateTime conStart, DateTime conEnd, PlayerStatus status)
    {
        return new Player
        {
            ClubId = clubId,
            NameAr = nameAr,
            NameEn = nameEn,
            JerseyNumber = jersey,
            Position = pos,
            DateOfBirth = dob,
            Nationality = nat,
            ContractStart = conStart,
            ContractEnd = conEnd,
            Status = status
        };
    }
}
