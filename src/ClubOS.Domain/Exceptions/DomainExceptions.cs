namespace ClubOS.Domain.Exceptions;

public class DomainException : Exception
{
    public string Code { get; }
    public DomainException(string code, string message) : base(message) => Code = code;
}

public class TenantNotFoundException : DomainException
{
    public TenantNotFoundException(Guid tenantId)
        : base("TENANT_NOT_FOUND", $"Tenant '{tenantId}' was not found.") { }
}

public class MemberNotFoundException : DomainException
{
    public MemberNotFoundException(Guid memberId)
        : base("MEMBER_NOT_FOUND", $"Member '{memberId}' was not found.") { }
}

public class TenantAccessViolationException : DomainException
{
    public TenantAccessViolationException()
        : base("TENANT_ACCESS_VIOLATION", "Access to a resource belonging to another tenant is not allowed.") { }
}

public class BusinessRuleViolationException : DomainException
{
    public BusinessRuleViolationException(string rule, string message)
        : base($"RULE_{rule.ToUpperInvariant()}", message) { }
}
