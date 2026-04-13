using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities;

/// <summary>
/// Extended profile for staff members, containing sensitive labor law data.
/// </summary>
public sealed class StaffProfile : BaseEntity, ITenantEntity
{
    private StaffProfile() { }

    public Guid ClubId { get; set; }
    public Guid StaffId { get; private set; }
    public string IqamaNumber { get; private set; } = default!;
    public DateTime IqamaExpiry { get; private set; }
    public string GosiRegistrationNumber { get; private set; } = default!;
    public string EmergencyContactName { get; private set; } = default!;
    public string EmergencyContactPhone { get; private set; } = default!;

    public static StaffProfile Create(Guid clubId, Guid staffId, string iqama, DateTime expiry, string gosi, string eName, string ePhone)
    {
        return new StaffProfile
        {
            ClubId = clubId,
            StaffId = staffId,
            IqamaNumber = iqama,
            IqamaExpiry = expiry,
            GosiRegistrationNumber = gosi,
            EmergencyContactName = eName,
            EmergencyContactPhone = ePhone
        };
    }
}

public sealed class StaffCertification : BaseEntity, ITenantEntity
{
    private StaffCertification() { }

    public Guid ClubId { get; set; }
    public Guid StaffId { get; private set; }
    public string NameEn { get; private set; } = default!;
    public string NameAr { get; private set; } = default!;
    public string IssuingBody { get; private set; } = default!; // e.g. Saudi FA
    public DateTime IssuedAt { get; private set; }
    public DateTime? ExpiryDate { get; private set; }

    public static StaffCertification Create(Guid clubId, Guid staffId, string nameEn, string nameAr, string body, DateTime issued, DateTime? expiry)
    {
        return new StaffCertification
        {
            ClubId = clubId,
            StaffId = staffId,
            NameEn = nameEn,
            NameAr = nameAr,
            IssuingBody = body,
            IssuedAt = issued,
            ExpiryDate = expiry
        };
    }
}

public sealed class TrainingRecord : BaseEntity, ITenantEntity
{
    private TrainingRecord() { }

    public Guid ClubId { get; set; }
    public Guid StaffId { get; private set; }
    public string CourseName { get; private set; } = default!;
    public DateTime CompletedAt { get; private set; }
    public int Hours { get; private set; }

    public static TrainingRecord Create(Guid clubId, Guid staffId, string course, DateTime completed, int hours)
    {
        return new TrainingRecord
        {
            ClubId = clubId,
            StaffId = staffId,
            CourseName = course,
            CompletedAt = completed,
            Hours = hours
        };
    }
}

public sealed class PerformanceReview : BaseEntity, ITenantEntity
{
    private PerformanceReview() { }

    public Guid ClubId { get; set; }
    public Guid StaffId { get; private set; }
    public Guid ReviewerId { get; private set; } // StaffId
    public int Rating { get; private set; } // 1-5
    public string Comments { get; private set; } = default!;
    public DateTime ReviewDate { get; private set; }

    public static PerformanceReview Create(Guid clubId, Guid staffId, Guid reviewerId, int rating, string comments, DateTime date)
    {
        return new PerformanceReview
        {
            ClubId = clubId,
            StaffId = staffId,
            ReviewerId = reviewerId,
            Rating = rating,
            Comments = comments,
            ReviewDate = date
        };
    }
}
