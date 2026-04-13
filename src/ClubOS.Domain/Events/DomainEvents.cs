using ClubOS.Domain.Common;

namespace ClubOS.Domain.Events;

public sealed record TenantCreatedEvent(Guid TenantId, string Name) : IDomainEvent;
public sealed record TenantActivatedEvent(Guid TenantId) : IDomainEvent;
public sealed record MemberEnrolledEvent(Guid TenantId, Guid MemberId, Guid AcademyId) : IDomainEvent;
public sealed record MemberSuspendedEvent(Guid TenantId, Guid MemberId) : IDomainEvent;
public sealed record FeedbackSubmittedEvent(Guid TenantId, Guid FeedbackId, Guid MemberId) : IDomainEvent;
public sealed record FeedbackResolvedEvent(Guid TenantId, Guid FeedbackId) : IDomainEvent;
public sealed record KpiRecordedEvent(Guid TenantId, Guid AcademyId, string KpiType) : IDomainEvent;
