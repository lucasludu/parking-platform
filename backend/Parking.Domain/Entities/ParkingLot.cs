namespace Parking.Domain.Entities;

public class ParkingLot
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int TotalSpots { get; set; }
    public decimal PricePerHour { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
