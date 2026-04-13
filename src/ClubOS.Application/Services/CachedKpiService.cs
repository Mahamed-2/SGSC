using System.Text.Json;
using ClubOS.Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace ClubOS.Application.Services;

public class CachedKpiService : IKpiService
{
    private readonly IKpiService _inner;
    private readonly IDistributedCache _cache;
    private readonly TimeSpan _defaultTtl = TimeSpan.FromMinutes(5);

    public CachedKpiService(IKpiService inner, IDistributedCache cache)
    {
        _inner = inner;
        _cache = cache;
    }

    public async Task<ClubHealthScoreDto> GetClubHealthScoreAsync(Guid clubId, CancellationToken ct = default)
    {
        string key = $"kpi:{clubId}:health";
        return await GetFromCacheOrSource(key, () => _inner.GetClubHealthScoreAsync(clubId, ct), ct);
    }

    public async Task<List<KpiValueDto>> GetDepartmentKPIsAsync(Guid clubId, string departmentCode, CancellationToken ct = default)
    {
        string key = $"kpi:{clubId}:dept:{departmentCode}";
        return await GetFromCacheOrSource(key, () => _inner.GetDepartmentKPIsAsync(clubId, departmentCode, ct), ct);
    }

    public async Task<PerformanceTrendDto> GetPlayerPerformanceTrendsAsync(Guid clubId, Guid playerId, DateTime start, DateTime end, CancellationToken ct = default)
    {
        // Trends are often specific to the date range, might skip caching or use a complex key
        string key = $"kpi:{clubId}:player:{playerId}:trends:{start:yyyyMMdd}-{end:yyyyMMdd}";
        return await GetFromCacheOrSource(key, () => _inner.GetPlayerPerformanceTrendsAsync(clubId, playerId, start, end, ct), ct);
    }

    public async Task<ComplianceStatusDto> GetComplianceStatusAsync(Guid clubId, CancellationToken ct = default)
    {
        string key = $"kpi:{clubId}:compliance";
        return await GetFromCacheOrSource(key, () => _inner.GetComplianceStatusAsync(clubId, ct), ct);
    }

    private async Task<T> GetFromCacheOrSource<T>(string key, Func<Task<T>> source, CancellationToken ct)
    {
        var cachedData = await _cache.GetStringAsync(key, ct);
        if (cachedData != null)
        {
            return JsonSerializer.Deserialize<T>(cachedData)!;
        }

        var result = await source();
        
        var options = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = _defaultTtl };
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(result), options, ct);

        return result;
    }
}
