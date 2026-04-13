using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities;

/// <summary>
/// Record of a player injury. Privacy-sensitive.
/// </summary>
public sealed class InjuryReport : BaseEntity, ITenantEntity
{
    private InjuryReport() { }

    public Guid ClubId { get; set; }
    public Guid PlayerId { get; private set; }
    public string InjuryTypeAr { get; private set; } = default!;
    public string InjuryTypeEn { get; private set; } = default!;
    public string Severity { get; private set; } = "Minor"; // Minor, Moderate, Severe
    public DateTime OccurredAt { get; private set; }
    public DateTime? ExpectedReturnDate { get; private set; }
    public string PrivacyLevel { get; private set; } = "Sensitive";

    public static InjuryReport Create(Guid clubId, Guid playerId, string typeEn, string typeAr, string severity, DateTime occurred, DateTime? estReturn)
    {
        return new InjuryReport
        {
            ClubId = clubId,
            PlayerId = playerId,
            InjuryTypeEn = typeEn,
            InjuryTypeAr = typeAr,
            Severity = severity,
            OccurredAt = occurred,
            ExpectedReturnDate = estReturn
        };
    }
}

public sealed class TreatmentPlan : BaseEntity, ITenantEntity
{
    private TreatmentPlan() { }

    public Guid ClubId { get; set; }
    public Guid InjuryReportId { get; private set; }
    public string DescriptionEn { get; private set; } = default!;
    public string DescriptionAr { get; private set; } = default!;
    public int SessionsPerWeek { get; private set; }
    public bool IsActive { get; private set; } = true;

    public static TreatmentPlan Create(Guid clubId, Guid injuryId, string descEn, string descAr, int sessions)
    {
        return new TreatmentPlan
        {
            ClubId = clubId,
            InjuryReportId = injuryId,
            DescriptionEn = descEn,
            DescriptionAr = descAr,
            SessionsPerWeek = sessions
        };
    }
}

public sealed class FitnessTest : BaseEntity, ITenantEntity
{
    private FitnessTest() { }

    public Guid ClubId { get; set; }
    public Guid PlayerId { get; private set; }
    public string TestType { get; private set; } = default!; // VO2Max, Sprint, Agility
    public string Result { get; private set; } = default!;
    public DateTime TestedAt { get; private set; }

    public static FitnessTest Create(Guid clubId, Guid playerId, string type, string result, DateTime at)
    {
        return new FitnessTest
        {
            ClubId = clubId,
            PlayerId = playerId,
            TestType = type,
            Result = result,
            TestedAt = at
        };
    }
}

public sealed class ClearanceCertificate : BaseEntity, ITenantEntity
{
    private ClearanceCertificate() { }

    public Guid ClubId { get; set; }
    public Guid PlayerId { get; private set; }
    public Guid DoctorId { get; private set; } // StaffId
    public DateTime IssuedAt { get; private set; }
    public string Notes { get; private set; } = default!;

    public static ClearanceCertificate Create(Guid clubId, Guid playerId, Guid doctorId, string notes)
    {
        return new ClearanceCertificate
        {
            ClubId = clubId,
            PlayerId = playerId,
            DoctorId = doctorId,
            IssuedAt = DateTime.UtcNow,
            Notes = notes
        };
    }
}
