using ClubOS.Application.Common.Interfaces;
using ClubOS.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ClubOS.Application.Features.Clubs.Queries;

public sealed class GetClubDepartmentsQueryHandler : IRequestHandler<GetClubDepartmentsQuery, List<DepartmentDto>>
{
    private readonly IAppDbContext _context;
    private readonly ITenantContext _tenantContext;

    public GetClubDepartmentsQueryHandler(IAppDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<List<DepartmentDto>> Handle(GetClubDepartmentsQuery request, CancellationToken cancellationToken)
    {
        // Extra Security: Verify requested ClubId matches the validated TenantId context
        if (request.ClubId != _tenantContext.TenantId)
            return new List<DepartmentDto>(); // Or throw UnauthorizedAccessException

        var departments = await _context.Departments
            .AsNoTracking()
            .Where(d => d.ClubId == request.ClubId && !d.IsDeleted)
            .OrderBy(d => d.NameEn)
            .Select(d => new DepartmentDto(
                d.Id,
                d.Code,
                d.NameEn,
                d.NameAr,
                d.IsActive,
                d.ParentId
            ))
            .ToListAsync(cancellationToken);

        return departments;
    }
}
