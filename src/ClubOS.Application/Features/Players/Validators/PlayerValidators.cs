using FluentValidation;

namespace ClubOS.Application.Features.Players.Validators;

public sealed class CreatePlayerCommandValidator : AbstractValidator<CreatePlayerCommand>
{
    public CreatePlayerCommandValidator()
    {
        RuleFor(v => v.NameAr).NotEmpty().MaximumLength(200);
        RuleFor(v => v.NameEn).NotEmpty().MaximumLength(200);
        RuleFor(v => v.JerseyNumber).InclusiveBetween(1, 99);
        RuleFor(v => v.Position).NotEmpty();
        RuleFor(v => v.Nationality).NotEmpty().Length(2);
        RuleFor(v => v.ContractStart).LessThan(v => v.ContractEnd);
        RuleFor(v => v.DateOfBirth).LessThan(DateTime.UtcNow.AddYears(-5)); // At least 5 years old
    }
}

public sealed class UpdatePlayerCommandValidator : AbstractValidator<UpdatePlayerCommand>
{
    public UpdatePlayerCommandValidator()
    {
        RuleFor(v => v.NameAr).NotEmpty().MaximumLength(200);
        RuleFor(v => v.NameEn).NotEmpty().MaximumLength(200);
        RuleFor(v => v.JerseyNumber).InclusiveBetween(1, 99);
        RuleFor(v => v.Position).NotEmpty();
    }
}
