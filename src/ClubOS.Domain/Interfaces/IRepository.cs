namespace ClubOS.Domain.Interfaces;

/// <summary>
/// Provides the current tenant context. Resolved from JWT claim by middleware.
/// Injected into repositories and application services.
/// </summary>
public interface ITenantContext
{
    Guid TenantId { get; }
    string? TenantSlug { get; }
    bool IsResolved { get; }
}

/// <summary>Repository abstraction for entities requiring tenant isolation.</summary>
public interface ITenantRepository<TEntity> : IRepository<TEntity>
    where TEntity : class
{
    // All queries are automatically scoped to the current TenantId
}

/// <summary>Generic repository contract.</summary>
public interface IRepository<TEntity> where TEntity : class
{
    Task<TEntity?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<TEntity>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(TEntity entity, CancellationToken ct = default);
    void Update(TEntity entity);
    void Delete(TEntity entity);
}

/// <summary>Unit of work pattern – commit all changes as a single transaction.</summary>
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
