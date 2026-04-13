using ClubOS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClubOS.Infrastructure.Persistence.Configurations;

public class PlayerConfiguration : IEntityTypeConfiguration<Player>
{
    public void Configure(EntityTypeBuilder<Player> builder)
    {
        // Add index on ClubId and Status for quick active player queries
        builder.HasIndex(p => new { p.ClubId, p.Status });
        builder.HasIndex(p => new { p.ClubId, p.JerseyNumber }).IsUnique();
    }
}

public class PerformanceMetricConfiguration : IEntityTypeConfiguration<PerformanceMetric>
{
    public void Configure(EntityTypeBuilder<PerformanceMetric> builder)
    {
        // Fast time-series lookups per player/session
        builder.HasIndex(m => new { m.ClubId, m.PlayerId, m.SessionId, m.MetricType });
        
        // Navigation Mapping
        builder.HasOne(m => m.Player)
               .WithMany(p => p.Metrics)
               .HasForeignKey(m => m.PlayerId)
               .OnDelete(DeleteBehavior.Cascade); // Hard delete metric if player is deleted from DB context explicitly
    }
}

public class TrainingSessionConfiguration : IEntityTypeConfiguration<TrainingSession>
{
    public void Configure(EntityTypeBuilder<TrainingSession> builder)
    {
        builder.HasIndex(t => new { t.ClubId, t.DepartmentId, t.DateTimeAST });
        
        // Because AttendedPlayerIds is a simple list of primitive Guids in our MVP:
        builder.Property(t => t.AttendedPlayerIds)
               .HasConversion(
                   v => string.Join(',', v),
                   v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(Guid.Parse).ToList()
               );
    }
}

public class ClubConfiguration : IEntityTypeConfiguration<Club>
{
    public void Configure(EntityTypeBuilder<Club> builder)
    {
        builder.HasIndex(c => c.NameEn).IsUnique();
    }
}
