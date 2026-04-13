namespace ClubOS.Application.Common.Models;

/// <summary>Generic paginated response envelope.</summary>
public sealed class PaginatedResult<T>
{
    public IReadOnlyList<T> Items { get; }
    public int TotalCount { get; }
    public int Page { get; }
    public int PageSize { get; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;

    public PaginatedResult(IReadOnlyList<T> items, int totalCount, int page, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        Page = page;
        PageSize = pageSize;
    }
}

/// <summary>Standard API response wrapper.</summary>
public sealed class ApiResponse<T>
{
    public bool Success { get; init; }
    public T? Data { get; init; }
    public string? MessageEn { get; init; }
    public string? MessageAr { get; init; }
    public IReadOnlyList<string>? Errors { get; init; }
    public string? TraceId { get; init; }

    public static ApiResponse<T> Ok(T data, string? msgEn = null, string? msgAr = null)
        => new() { Success = true, Data = data, MessageEn = msgEn, MessageAr = msgAr };

    public static ApiResponse<T> Fail(IReadOnlyList<string> errors, string? traceId = null)
        => new() { Success = false, Errors = errors, TraceId = traceId };
}
