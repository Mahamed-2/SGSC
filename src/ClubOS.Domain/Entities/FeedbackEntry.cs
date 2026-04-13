using ClubOS.Domain.Common;
using ClubOS.Domain.Enums;

namespace ClubOS.Domain.Entities;

/// <summary>
/// Saudi governance pillar: structured feedback loop entry.
/// Supports Vision 2030 decision traceability requirements.
/// </summary>
public sealed class FeedbackEntry : TenantEntity
{
    private FeedbackEntry() { }

    public Guid MemberId { get; private set; }
    public Member Member { get; private set; } = default!;
    public FeedbackCategory Category { get; private set; }
    public FeedbackSentiment Sentiment { get; private set; }
    public string Subject { get; private set; } = default!;
    public string Body { get; private set; } = default!;
    public FeedbackStatus Status { get; private set; } = FeedbackStatus.Open;
    public string? ResolutionNote { get; private set; }
    public DateTime? ResolvedAt { get; private set; }
    public string? ResolvedByUserId { get; private set; }

    public static FeedbackEntry Submit(
        Guid tenantId, Guid memberId, FeedbackCategory category,
        FeedbackSentiment sentiment, string subject, string body)
        => new()
        {
            TenantId = tenantId,
            MemberId = memberId,
            Category = category,
            Sentiment = sentiment,
            Subject = subject,
            Body = body
        };

    public void Resolve(string note, string resolvedByUserId)
    {
        Status = FeedbackStatus.Resolved;
        ResolutionNote = note;
        ResolvedAt = DateTime.UtcNow;
        ResolvedByUserId = resolvedByUserId;
    }
}
