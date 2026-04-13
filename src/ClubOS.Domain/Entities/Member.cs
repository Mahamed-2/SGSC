using ClubOS.Domain.Common;
using ClubOS.Domain.Enums;

namespace ClubOS.Domain.Entities;

/// <summary>
/// Represents a member (player, coach, staff) of a sports academy.
/// </summary>
public sealed class Member : TenantEntity
{
    private Member() { }

    public string FirstNameEn { get; private set; } = default!;
    public string LastNameEn { get; private set; } = default!;
    public string FirstNameAr { get; private set; } = default!;
    public string LastNameAr { get; private set; } = default!;
    public string NationalId { get; private set; } = default!;   // Saudi NID (10 digits)
    public DateOnly DateOfBirth { get; private set; }
    public Gender Gender { get; private set; }
    public MemberRole Role { get; private set; }
    public MemberStatus Status { get; private set; } = MemberStatus.Active;
    public string? Email { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string? ProfileImageUrl { get; private set; }

    // Foreign keys
    public Guid AcademyId { get; private set; }
    public Academy Academy { get; private set; } = default!;

    // Navigation
    public ICollection<FeedbackEntry> Feedbacks { get; private set; } = new List<FeedbackEntry>();

    public static Member Create(
        Guid tenantId, Guid academyId, string firstNameEn, string lastNameEn,
        string firstNameAr, string lastNameAr, string nationalId,
        DateOnly dob, Gender gender, MemberRole role, string? email = null)
        => new()
        {
            TenantId = tenantId,
            AcademyId = academyId,
            FirstNameEn = firstNameEn,
            LastNameEn = lastNameEn,
            FirstNameAr = firstNameAr,
            LastNameAr = lastNameAr,
            NationalId = nationalId,
            DateOfBirth = dob,
            Gender = gender,
            Role = role,
            Email = email
        };

    public string FullNameEn => $"{FirstNameEn} {LastNameEn}";
    public string FullNameAr => $"{FirstNameAr} {LastNameAr}";
    public int Age => DateOnly.FromDateTime(DateTime.UtcNow).Year - DateOfBirth.Year;

    public void Suspend() => Status = MemberStatus.Suspended;
    public void Activate() => Status = MemberStatus.Active;
}
