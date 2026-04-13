using ClubOS.Application.Common.Interfaces;
using ClubOS.Application.Common.Models;
using ClubOS.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ClubOS.Application.Services;

public class KpiService : IKpiService
{
    private readonly IApplicationDbContext _context;

    public KpiService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ClubHealthScoreDto> GetClubHealthScoreAsync(Guid clubId, CancellationToken ct = default)
    {
        // ── CATEGORY SCORES (MOCK LOGIC FOR DEMO) ──────────────────────────
        // In a real system, these would call specialized aggregator methods
        var footballScore = await CalculateFootballScore(clubId, ct);
        var medicalScore  = await CalculateMedicalScore(clubId, ct);
        var financeScore  = await CalculateFinanceScore(clubId, ct);
        var hrScore       = await CalculateHrScore(clubId, ct);

        // EQUAL WEIGHTING (25% each)
        var totalScore = (footballScore + medicalScore + financeScore + hrScore) / 4;

        return new ClubHealthScoreDto(
            clubId,
            Math.Round(totalScore, 2),
            new Dictionary<string, decimal>
            {
                { "Football Ops", footballScore },
                { "Medical",      medicalScore },
                { "Finance",      financeScore },
                { "HR",           hrScore }
            },
            DateTime.UtcNow
        );
    }

    public async Task<List<KpiValueDto>> GetDepartmentKPIsAsync(Guid clubId, string departmentCode, CancellationToken ct = default)
    {
        // Logic branches based on department
        return departmentCode.ToUpper() switch
        {
            "FOOTBALL_OPS" => await GetFootballKPIs(clubId, ct),
            "MEDICAL"      => await GetMedicalKPIs(clubId, ct),
            _              => new List<KpiValueDto>()
        };
    }

    public async Task<PerformanceTrendDto> GetPlayerPerformanceTrendsAsync(Guid clubId, Guid playerId, DateTime start, DateTime end, CancellationToken ct = default)
    {
        var player = await _context.Players.FindAsync(new object[] { playerId }, ct);
        if (player == null) return null!;

        var dataPoints = await _context.PerformanceMetrics
            .Where(m => m.PlayerId == playerId && m.RecordedAtAST >= start && m.RecordedAtAST <= end)
            .OrderBy(m => m.RecordedAtAST)
            .Select(m => new TrendPointDto(m.RecordedAtAST, m.MetricType.ToString(), m.Value))
            .ToListAsync(ct);

        return new PerformanceTrendDto(playerId, player.NameEn, dataPoints);
    }

    public async Task<ComplianceStatusDto> GetComplianceStatusAsync(Guid clubId, CancellationToken ct = default)
    {
        // Simulated compliance checklist
        var requirements = new List<ComplianceRequirementDto>
        {
            new("Saudi Governance Pillar 1", "ركيزة الحوكمة السعودية 1", true, "Mandatory"),
            new("Financial Audit 2023", "التدقيق المالي 2023", true, "Mandatory"),
            new("Youth Academy Certification", "شهادة أكاديمية الفئات السنية", false, "Gold"),
            new("Environmental Sustainability Index", "مؤشر الاستدامة البيئية", true, "Standard")
        };

        var completion = (decimal)requirements.Count(r => r.IsMet) / requirements.Count * 100;

        return new ComplianceStatusDto(clubId, Math.Round(completion, 2), requirements);
    }

    // ── PRIVATE AGGREGATORS ───────────────────────────────────────────

    private async Task<decimal> CalculateFootballScore(Guid clubId, CancellationToken ct)
    {
        // Example: Win Rate + Youth promotion weighted
        var winRate = await _context.KpiRecords
            .Where(k => k.TenantId == clubId && k.Type == KpiType.MatchWinRate)
            .OrderByDescending(k => k.PeriodDate)
            .Select(k => k.Value)
            .FirstOrDefaultAsync(ct);
        
        return winRate > 0 ? winRate : 75; // Default for demo
    }

    private async Task<decimal> CalculateMedicalScore(Guid clubId, CancellationToken ct) => 82; // Mock
    private async Task<decimal> CalculateFinanceScore(Guid clubId, CancellationToken ct) => 68; // Mock
    private async Task<decimal> CalculateHrScore(Guid clubId, CancellationToken ct)      => 91; // Mock

    private async Task<List<KpiValueDto>> GetFootballKPIs(Guid clubId, CancellationToken ct)
    {
        return new List<KpiValueDto>
        {
            new("Match Win Rate", "نسبة الفوز بالمباريات", 62.5m, "%", "Up"),
            new("Goals Per Match", "الأهداف لكل مباراة", 2.1m, "Goals", "Stable"),
            new("Youth Promotion Rate", "نسبة تصعيد الناشئين", 15.0m, "%", "Up")
        };
    }

    private async Task<List<KpiValueDto>> GetMedicalKPIs(Guid clubId, CancellationToken ct)
    {
        return new List<KpiValueDto>
        {
            new("Injury Frequency", "تكرار الإصابات", 12.4m, "per 1000h", "Down"),
            new("Avg Recovery Time", "متوسط وقت التعافي", 18.0m, "Days", "Stable")
        };
    }
}
