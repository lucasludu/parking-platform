using Microsoft.EntityFrameworkCore;
using Parking.Domain.Entities;

namespace Parking.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<ParkingLot> ParkingLots { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ParkingLot>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Address).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PricePerHour).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.LicensePlate).IsRequired().HasMaxLength(20);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.ParkingLot)
                  .WithMany()
                  .HasForeignKey(e => e.ParkingLotId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
        });
    }
}
