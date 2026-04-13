using ClubOS.Domain.Common;
using ClubOS.Domain.Enums;

namespace ClubOS.Domain.Entities;

/// <summary>
/// A training drill for the drill library, supporting video instructions.
/// </summary>
public sealed class FootballDrill : BaseEntity, ITenantEntity
{
    private FootballDrill() { }

    public Guid ClubId { get; set; }
    public string TitleEn { get; private set; } = default!;
    public string TitleAr { get; private set; } = default!;
    public string Category { get; private set; } = default!;// e.g. Tactical, Technical, Physical
    public string DescriptionAr { get; private set; } = default!;
    public string DescriptionEn { get; private set; } = default!;
    public string? VideoUrl { get; private set; } // YouTube/Vimeo links

    public static FootballDrill Create(Guid clubId, string titleEn, string titleAr, string category, string descEn, string descAr, string? videoUrl)
    {
        return new FootballDrill
        {
            ClubId = clubId,
            TitleEn = titleEn,
            TitleAr = titleAr,
            Category = category,
            DescriptionEn = descEn,
            DescriptionAr = descAr,
            VideoUrl = videoUrl
        };
    }
}

/// <summary>
/// A tactical match plan for an upcoming game.
/// </summary>
public sealed class MatchPlan : BaseEntity, ITenantEntity
{
    private MatchPlan() { }

    public Guid ClubId { get; set; }
    public string Opponent { get; private set; } = default!;
    public DateTime MatchDateAST { get; private set; }
    public string Formation { get; private set; } = "4-3-3";
    public string TacticalNotesAr { get; private set; } = default!;
    public string TacticalNotesEn { get; private set; } = default!;
    
    // Lineup stored as serialized JSON for flexible tactical setup
    public string LineupJson { get; private set; } = "[]";

    public static MatchPlan Create(Guid clubId, string opponent, DateTime dateAst, string formation, string notesEn, string notesAr, string lineupJson)
    {
        return new MatchPlan
        {
            ClubId = clubId,
            Opponent = opponent,
            MatchDateAST = dateAst,
            Formation = formation,
            TacticalNotesEn = notesEn,
            TacticalNotesAr = notesAr,
            LineupJson = lineupJson
        };
    }
}
