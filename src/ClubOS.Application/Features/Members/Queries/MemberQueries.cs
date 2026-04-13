using MediatR;
using ClubOS.Application.Common.Models;

namespace ClubOS.Application.Features.Members.Queries;

// ---------- List Members ----------
public sealed record GetMembersQuery(
    Guid? AcademyId = null,
    string? RoleFilter = null,
    string? StatusFilter = null,
    int Page = 1,
    int PageSize = 25
) : IRequest<PaginatedResult<MemberDto>>;

// ---------- Single Member ----------
public sealed record GetMemberByIdQuery(Guid MemberId) : IRequest<MemberDto?>;

// ---------- DTO ----------
public sealed record MemberDto(
    Guid Id,
    string FullNameEn,
    string FullNameAr,
    string NationalId,
    int Age,
    string Gender,
    string Role,
    string Status,
    string? Email,
    string AcademyNameEn,
    string AcademyNameAr,
    DateTime CreatedAt
);
