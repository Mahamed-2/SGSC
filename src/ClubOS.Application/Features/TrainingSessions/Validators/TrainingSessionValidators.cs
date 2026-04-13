using FluentValidation;

namespace ClubOS.Application.Features.TrainingSessions.Validators;

public sealed class CreateTrainingSessionCommandValidator : AbstractValidator<CreateTrainingSessionCommand>
{
    public CreateTrainingSessionCommandValidator()
    {
        RuleFor(v => v.Title).NotEmpty().MaximumLength(200);
        RuleFor(v => v.Location).NotEmpty().MaximumLength(200);
        RuleFor(v => v.DurationMinutes).InclusiveBetween(15, 300);
        RuleFor(v => v.DateTimeAST).GreaterThan(DateTime.UtcNow); // Must be in the future
    }
}
