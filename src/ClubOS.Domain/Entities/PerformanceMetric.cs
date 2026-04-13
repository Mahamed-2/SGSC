using ClubOS.Domain.Common;
using ClubOS.Domain.Enums;

namespace ClubOS.Domain.Entities;

public sealed class PerformanceMetric : BaseEntity, ITenantEntity
{
    private PerformanceMetric() { }

    public Guid ClubId { get; set; }
    
    public Guid PlayerId { get; private set; }
    public Guid SessionId { get; private set; }
    
    public MetricType MetricType { get; private set; }
    public decimal Value { get; private set; }
    
    public DateTime RecordedAtAST { get; private set; }

    // Navigation
    public Player Player { get; private set; } = default!;

    public static PerformanceMetric Create(Guid clubId, Guid playerId, Guid sessionId, MetricType type, decimal val, DateTime recordedAst)
    {
        return new PerformanceMetric
        {
            ClubId = clubId,
            PlayerId = playerId,
            SessionId = sessionId,
            MetricType = type,
            Value = val,
            RecordedAtAST = recordedAst
        };
    }
}
