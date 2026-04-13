using ClubOS.Domain.Entities;
using MediatR;

namespace ClubOS.Application.Features.Members.Commands;

// ---------- Create Member ----------
public sealed record CreateMemberCommand(
    Guid AcademyId,
    string FirstNameEn, string LastNameEn,
    string FirstNameAr, string LastNameAr,
    string NationalId, DateOnly DateOfBirth,
    string Gender, string Role,
    string? Email, string? PhoneNumber
) : IRequest<Guid>;

// ---------- Suspend Member ----------
public sealed record SuspendMemberCommand(Guid MemberId) : IRequest<bool>;

// ---------- Activate Member ----------
public sealed record ActivateMemberCommand(Guid MemberId) : IRequest<bool>;
