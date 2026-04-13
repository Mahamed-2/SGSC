using ClubOS.Domain.Entities.Identity;
using ClubOS.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClubOS.Infrastructure.Identity.Configurations;

public sealed class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Code).IsRequired().HasMaxLength(50);
        builder.Property(e => e.NameEn).IsRequired().HasMaxLength(200);
        builder.Property(e => e.NameAr).IsRequired().HasMaxLength(200);

        builder.HasIndex(e => new { e.TenantId, e.Code }).IsUnique();

        // One-to-many: Department can have multiple UserDepartments
        builder.HasMany(e => e.UserDepartments)
               .WithOne(e => e.Department)
               .HasForeignKey(e => e.DepartmentId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Key).IsRequired().HasMaxLength(100);
        builder.HasIndex(e => e.Key).IsUnique();

        builder.Property(e => e.Resource).IsRequired().HasMaxLength(50);
        builder.Property(e => e.Action).HasConversion<string>();
        builder.Property(e => e.Scope).HasConversion<string>();
    }
}

public sealed class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.HasKey(e => e.Id);
        builder.ToTable("AuditLogs");

        builder.Property(e => e.EventType).HasConversion<string>();
        builder.Property(e => e.Outcome).HasConversion<string>();

        builder.HasIndex(e => e.OccurredAtUtc);
        builder.HasIndex(e => e.UserId);
        builder.HasIndex(e => e.TenantId);
    }
}

public sealed class UserDepartmentConfiguration : IEntityTypeConfiguration<UserDepartment>
{
    public void Configure(EntityTypeBuilder<UserDepartment> builder)
    {
        builder.HasKey(e => new { e.UserId, e.DepartmentId });

        builder.HasOne<ApplicationUser>()
               .WithMany(u => u.UserDepartments)
               .HasForeignKey(ud => ud.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ud => ud.Department)
               .WithMany(d => d.UserDepartments)
               .HasForeignKey(ud => ud.DepartmentId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.HasKey(rp => new { rp.RoleId, rp.PermissionId, rp.DepartmentId });

        builder.HasOne<ApplicationRole>()
               .WithMany(r => r.RolePermissions)
               .HasForeignKey(rp => rp.RoleId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(rp => rp.Permission)
               .WithMany(p => p.RolePermissions)
               .HasForeignKey(rp => rp.PermissionId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Department>()
               .WithMany()
               .HasForeignKey(rp => rp.DepartmentId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.SetNull);
    }
}
