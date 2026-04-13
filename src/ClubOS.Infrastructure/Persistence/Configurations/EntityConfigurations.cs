using ClubOS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClubOS.Infrastructure.Persistence.Configurations;

public sealed class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.NameEn).IsRequired().HasMaxLength(150);
        builder.Property(t => t.NameAr).IsRequired().HasMaxLength(150);
        builder.Property(t => t.Slug).IsRequired().HasMaxLength(80);
        builder.HasIndex(t => t.Slug).IsUnique();
        builder.Property(t => t.ContactEmail).HasMaxLength(256);
        builder.Property(t => t.Plan).HasConversion<string>();
        builder.Property(t => t.Status).HasConversion<string>();
        builder.OwnsOne(t => t.Settings, s =>
        {
            s.ToJson(); // EF8+ JSON column
        });
    }
}

public sealed class AcademyConfiguration : IEntityTypeConfiguration<Academy>
{
    public void Configure(EntityTypeBuilder<Academy> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.NameEn).IsRequired().HasMaxLength(200);
        builder.Property(a => a.NameAr).IsRequired().HasMaxLength(200);
        builder.Property(a => a.City).IsRequired().HasMaxLength(100);
        builder.Property(a => a.SportType).HasConversion<string>();
        builder.HasIndex(a => new { a.TenantId, a.NameEn });

        builder.HasOne<Tenant>()
            .WithMany(t => t.Academies)
            .HasForeignKey(a => a.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public sealed class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> builder)
    {
        builder.HasKey(m => m.Id);
        builder.Property(m => m.FirstNameEn).IsRequired().HasMaxLength(100);
        builder.Property(m => m.LastNameEn).IsRequired().HasMaxLength(100);
        builder.Property(m => m.FirstNameAr).IsRequired().HasMaxLength(100);
        builder.Property(m => m.LastNameAr).IsRequired().HasMaxLength(100);
        builder.Property(m => m.NationalId).IsRequired().HasMaxLength(10);
        builder.HasIndex(m => new { m.TenantId, m.NationalId }).IsUnique();
        builder.Property(m => m.Gender).HasConversion<string>();
        builder.Property(m => m.Role).HasConversion<string>();
        builder.Property(m => m.Status).HasConversion<string>();
        builder.Property(m => m.Email).HasMaxLength(256);
        builder.Property(m => m.PhoneNumber).HasMaxLength(20);
        builder.HasIndex(m => new { m.TenantId, m.AcademyId });

        builder.HasOne(m => m.Academy)
            .WithMany(a => a.Members)
            .HasForeignKey(m => m.AcademyId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public sealed class FeedbackConfiguration : IEntityTypeConfiguration<FeedbackEntry>
{
    public void Configure(EntityTypeBuilder<FeedbackEntry> builder)
    {
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Subject).IsRequired().HasMaxLength(300);
        builder.Property(f => f.Body).IsRequired().HasMaxLength(4000);
        builder.Property(f => f.Category).HasConversion<string>();
        builder.Property(f => f.Sentiment).HasConversion<string>();
        builder.Property(f => f.Status).HasConversion<string>();
        builder.HasIndex(f => new { f.TenantId, f.Status });

        builder.HasOne(f => f.Member)
            .WithMany(m => m.Feedbacks)
            .HasForeignKey(f => f.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public sealed class KpiRecordConfiguration : IEntityTypeConfiguration<KpiRecord>
{
    public void Configure(EntityTypeBuilder<KpiRecord> builder)
    {
        builder.HasKey(k => k.Id);
        builder.Property(k => k.Type).HasConversion<string>();
        builder.Property(k => k.Value).HasPrecision(18, 4);
        builder.Property(k => k.Unit).HasMaxLength(20);
        builder.Property(k => k.Notes).HasMaxLength(1000);
        builder.HasIndex(k => new { k.TenantId, k.AcademyId, k.PeriodDate, k.Type }).IsUnique();

        builder.HasOne(k => k.Academy)
            .WithMany(a => a.KpiRecords)
            .HasForeignKey(k => k.AcademyId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
