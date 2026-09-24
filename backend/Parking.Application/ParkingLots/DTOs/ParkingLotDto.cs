namespace Parking.Application.ParkingLots.DTOs;

public record ParkingLotDto(
    Guid Id,
    string Name,
    string Address,
    int TotalSpots,
    decimal PricePerHour,
    double Latitude,
    double Longitude
);
