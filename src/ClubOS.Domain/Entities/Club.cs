using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities;

/// <summary>
/// Root tenant aggregate representing a football club (e.g., Al-Faisaly FC).
/// </summary>
public sealed class Club : BaseEntity, ITenantEntity
{
    private Club() { }

    public string NameAr { get; private set; } = default!;
    public string NameEn { get; private set; } = default!;
    public string? LogoUrl { get; private set; }
    
    /// <summary>Hijri year of foundation, e.g., 1374 AH.</summary>
    public int FoundedYear { get; private set; }
    
    public string Location { get; private set; } = default!;
    
    /// <summary>Reference to strategic goals like 'Strategy2023-2027'.</summary>
    public string? StrategyRef { get; private set; }

    /// <summary>The ClubId inherently maps to its own Id as the Root Tenant.</summary>
    public Guid ClubId 
    { 
        get => Id; 
        set { /* No-op, Id is immutable root */ } 
    }

    public static Club Create(string nameAr, string nameEn, string location, int foundedYear, string? strategyRef = null)
    {
        return new Club
        {
            NameAr = nameAr,
            NameEn = nameEn,
            Location = location,
            FoundedYear = foundedYear,
            StrategyRef = strategyRef
        };
    }
}
