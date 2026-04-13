using ClubOS.Application.Common.Interfaces;
using ClubOS.Application.Common.Models;
using ClubOS.Application.Features.Members.Queries;
using ClubOS.Domain.Enums;
using ClubOS.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ClubOS.Application.Features.Members.Queries;

public sealed class GetMembersQueryHandler : IRequestHandler<GetMembersQuery, PaginatedResult<MemberDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public GetMembersQueryHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<PaginatedResult<MemberDto>> Handle(GetMembersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Members
            .AsNoTracking()
            .Include(m => m.Academy)
            .Where(m => m.TenantId == _tenantContext.TenantId && !m.IsDeleted);

        if (request.AcademyId.HasValue)
            query = query.Where(m => m.AcademyId == request.AcademyId.Value);

        if (!string.IsNullOrWhiteSpace(request.RoleFilter) && Enum.TryParse<MemberRole>(request.RoleFilter, true, out var role))
            query = query.Where(m => m.Role == role);

        if (!string.IsNullOrWhiteSpace(request.StatusFilter) && Enum.TryParse<MemberStatus>(request.StatusFilter, true, out var status))
            query = query.Where(m => m.Status == status);

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(m => m.LastNameEn)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(m => new MemberDto(
                m.Id,
                m.FullNameEn,
                m.FullNameAr,
                m.NationalId,
                m.Age,
                m.Gender.ToString(),
                m.Role.ToString(),
                m.Status.ToString(),
                m.Email,
                m.Academy.NameEn,
                m.Academy.NameAr,
                m.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        return new PaginatedResult<MemberDto>(items, total, request.Page, request.PageSize);
    }
}

public sealed class GetMemberByIdQueryHandler : IRequestHandler<GetMemberByIdQuery, MemberDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public GetMemberByIdQueryHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<MemberDto?> Handle(GetMemberByIdQuery request, CancellationToken cancellationToken)
    {
        var m = await _context.Members
            .AsNoTracking()
            .Include(m => m.Academy)
            .FirstOrDefaultAsync(
                m => m.Id == request.MemberId && m.TenantId == _tenantContext.TenantId && !m.IsDeleted,
                cancellationToken);

        if (m is null) return null;

        return new MemberDto(m.Id, m.FullNameEn, m.FullNameAr, m.NationalId, m.Age,
            m.Gender.ToString(), m.Role.ToString(), m.Status.ToString(),
            m.Email, m.Academy.NameEn, m.Academy.NameAr, m.CreatedAt);
    }
}
