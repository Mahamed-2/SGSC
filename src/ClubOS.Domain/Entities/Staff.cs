using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities;

public sealed class Staff : BaseEntity, ITenantEntity
{
    private Staff() { }

    public Guid ClubId { get; set; }
    public Guid DepartmentId { get; private set; }
    
    public string NameAr { get; private set; } = default!;
    public string NameEn { get; private set; } = default!;
    
    public string Role { get; private set; } = default!;
    public DateTime HireDate { get; private set; }
    
    public string Qualifications { get; private set; } = default!;
    public string ContactInfo { get; private set; } = default!;

    public static Staff Create(Guid clubId, Guid deptId, string nameAr, string nameEn, string role, DateTime hireDate, string qual, string contact)
    {
        return new Staff
        {
            ClubId = clubId,
            DepartmentId = deptId,
            NameAr = nameAr,
            NameEn = nameEn,
            Role = role,
            HireDate = hireDate,
            Qualifications = qual,
            ContactInfo = contact
        };
    }
}
