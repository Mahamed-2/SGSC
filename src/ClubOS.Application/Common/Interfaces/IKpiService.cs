using ClubOS.Domain.Enums;

namespace ClubOS.Application.Common.Interfaces;

public interface IKpiService
{
    Task<ClubHealthScoreDto> GetClubHealthScoreAsync(Guid clubId, CancellationToken ct = default);
    Task<List<KpiValueDto>> GetDepartmentKPIsAsync(Guid clubId, string departmentCode, CancellationToken ct = default);
    Task<PerformanceTrendDto> GetPlayerPerformanceTrendsAsync(Guid clubId, Guid playerId, DateTime start, DateTime end, CancellationToken ct = default);
    Task<ComplianceStatusDto> GetComplianceStatusAsync(Guid clubId, CancellationToken ct = default);
}

public sealed record ClubHealthScoreDto(
    Guid ClubId,
    decimal TotalScore, // 0-100
    Dictionary<string, decimal> CategoryScores, // Football, Medical, Finance, HR
    DateTime CalculatedAt
);

public sealed record KpiValueDto(
    string NameEn,
    string NameAr,
    decimal Value,
    string Unit,
    string Trend // "Up", "Down", "Stable"
);

public sealed record PerformanceTrendDto(
    Guid PlayerId,
    string PlayerName,
    List<TrendPointDto> DataPoints
);

public sealed record TrendPointDto(
    DateTime Date,
    string MetricType,
    decimal Value
);

public sealed record ComplianceStatusDto(
    Guid ClubId,
    decimal CompletionPercentage,
    List<ComplianceRequirementDto> Requirements
);

public sealed record ComplianceRequirementDto(
    string NameEn,
    string NameAr,
    bool IsMet,
    string Level // "Standard", "Mandatory", "Gold"
);
