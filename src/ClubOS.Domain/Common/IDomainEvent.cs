using MediatR;

namespace ClubOS.Domain.Common;

/// <summary>
/// Marker interface for domain events. Implements INotification for MediatR dispatch.
/// </summary>
public interface IDomainEvent : INotification { }
