using ClubOS.Domain.Common;

namespace ClubOS.Domain.Entities;

/// <summary>
/// A line item in the club's budget.
/// </summary>
public sealed class BudgetItem : BaseEntity, ITenantEntity
{
    private BudgetItem() { }

    public Guid ClubId { get; set; }
    public string CategoryEn { get; private set; } = default!;
    public string CategoryAr { get; private set; } = default!;
    public decimal AllocatedAmount { get; private set; }
    public decimal ActualAmount { get; private set; }
    public string Currency { get; private set; } = "SAR";
    public int FiscalYear { get; private set; }
    public int Quarter { get; private set; } // 1, 2, 3, 4

    public static BudgetItem Create(Guid clubId, string catEn, string catAr, decimal allocated, decimal actual, int year, int quarter)
    {
        return new BudgetItem
        {
            ClubId = clubId,
            CategoryEn = catEn,
            CategoryAr = catAr,
            AllocatedAmount = allocated,
            ActualAmount = actual,
            FiscalYear = year,
            Quarter = quarter
        };
    }
}

public sealed class ExpenseReport : BaseEntity, ITenantEntity
{
    private ExpenseReport() { }

    public Guid ClubId { get; set; }
    public Guid RequestorId { get; private set; } // StaffId
    public string Purpose { get; private set; } = default!;
    public decimal Amount { get; private set; }
    public string Status { get; private set; } = "Pending"; // Pending, Approved, Rejected
    public Guid? ApproverId { get; private set; }

    public static ExpenseReport Create(Guid clubId, Guid requestorId, string purpose, decimal amount)
    {
        return new ExpenseReport
        {
            ClubId = clubId,
            RequestorId = requestorId,
            Purpose = purpose,
            Amount = amount
        };
    }
}

public sealed class SponsorshipContract : BaseEntity, ITenantEntity
{
    private SponsorshipContract() { }

    public Guid ClubId { get; set; }
    public string PartnerName { get; private set; } = default!;
    public decimal ContractValue { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public string VatNumber { get; private set; } = default!; // Saudi VAT compliance

    public static SponsorshipContract Create(Guid clubId, string partner, decimal value, DateTime start, DateTime end, string vat)
    {
        return new SponsorshipContract
        {
            ClubId = clubId,
            PartnerName = partner,
            ContractValue = value,
            StartDate = start,
            EndDate = end,
            VatNumber = vat
        };
    }
}

public sealed class PayrollEntry : BaseEntity, ITenantEntity
{
    private PayrollEntry() { }

    public Guid ClubId { get; set; }
    public Guid EmployeeId { get; private set; } // Staff or Player ID
    public string EmployeeType { get; private set; } = "Staff"; // Staff, Player
    public decimal BaseSalary { get; private set; }
    public decimal Bonuses { get; private set; }
    public DateTime PaymentDate { get; private set; }

    public static PayrollEntry Create(Guid clubId, Guid empId, string type, decimal baseSal, decimal bonuses, DateTime payDate)
    {
        return new PayrollEntry
        {
            ClubId = clubId,
            EmployeeId = empId,
            EmployeeType = type,
            BaseSalary = baseSal,
            Bonuses = bonuses,
            PaymentDate = payDate
        };
    }
}
