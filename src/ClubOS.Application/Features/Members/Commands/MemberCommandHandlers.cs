using ClubOS.Application.Common.Interfaces;
using ClubOS.Application.Common.Models;
using ClubOS.Domain.Entities;
using ClubOS.Domain.Enums;
using ClubOS.Domain.Interfaces;
using MediatR;

namespace ClubOS.Application.Features.Members.Commands;

public sealed class CreateMemberCommandHandler : IRequestHandler<CreateMemberCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public CreateMemberCommandHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<Guid> Handle(CreateMemberCommand request, CancellationToken cancellationToken)
    {
        var gender = Enum.Parse<Gender>(request.Gender, ignoreCase: true);
        var role   = Enum.Parse<MemberRole>(request.Role, ignoreCase: true);

        var member = Member.Create(
            tenantId:    _tenantContext.TenantId,
            academyId:   request.AcademyId,
            firstNameEn: request.FirstNameEn,
            lastNameEn:  request.LastNameEn,
            firstNameAr: request.FirstNameAr,
            lastNameAr:  request.LastNameAr,
            nationalId:  request.NationalId,
            dob:         request.DateOfBirth,
            gender:      gender,
            role:        role,
            email:       request.Email
        );

        await _context.Members.AddAsync(member, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return member.Id;
    }
}

public sealed class SuspendMemberCommandHandler : IRequestHandler<SuspendMemberCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public SuspendMemberCommandHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<bool> Handle(SuspendMemberCommand request, CancellationToken cancellationToken)
    {
        var member = await _context.Members.FindAsync([request.MemberId], cancellationToken);
        if (member is null || member.TenantId != _tenantContext.TenantId) return false;
        member.Suspend();
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
