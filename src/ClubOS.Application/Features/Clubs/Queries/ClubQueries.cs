using MediatR;
using ClubOS.Application.Common.Models;

namespace ClubOS.Application.Features.Clubs.Queries;

// ---------- List Departments ----------
public sealed record GetClubDepartmentsQuery(Guid ClubId) : IRequest<List<DepartmentDto>>;

// ---------- DTO ----------
public sealed record DepartmentDto(
    Guid Id,
    string Code,
    string NameEn,
    string NameAr,
    bool IsActive,
    Guid? ParentId
);
