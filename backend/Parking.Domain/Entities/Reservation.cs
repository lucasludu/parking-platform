using Parking.Domain.Enums;

namespace Parking.Domain.Entities;

public class Reservation
{
    public Guid Id { get; set; }
    public Guid ParkingLotId { get; set; }
    public ParkingLot ParkingLot { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string LicensePlate { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal TotalAmount { get; set; }
    public ReservationStatus Status { get; set; }
}
