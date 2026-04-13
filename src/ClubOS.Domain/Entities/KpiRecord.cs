using ClubOS.Domain.Common;
using ClubOS.Domain.Enums;

namespace ClubOS.Domain.Entities;

/// <summary>
/// KPI record for an academy – supports decision systems governance pillar.
/// Each record captures a point-in-time snapshot of key performance indicators.
/// </summary>
public sealed class KpiRecord : TenantEntity
{
    private KpiRecord() { }

    public Guid AcademyId { get; private set; }
    public Academy Academy { get; private set; } = default!;
    public KpiType Type { get; private set; }
    public decimal Value { get; private set; }
    public string? Unit { get; private set; }      // e.g. "%" or "SAR"
    public DateOnly PeriodDate { get; private set; }
    public string? Notes { get; private set; }

    public static KpiRecord Record(
        Guid tenantId, Guid academyId, KpiType type,
        decimal value, string? unit, DateOnly period, string? notes = null)
        => new()
        {
            TenantId = tenantId,
            AcademyId = academyId,
            Type = type,
            Value = value,
            Unit = unit,
            PeriodDate = period,
            Notes = notes
        };
}
