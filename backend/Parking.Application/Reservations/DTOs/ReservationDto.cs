using Parking.Domain.Enums;

namespace Parking.Application.Reservations.DTOs;

public record ReservationDto(
    Guid Id,
    Guid ParkingLotId,
    Guid UserId,
    string LicensePlate,
    DateTime StartTime,
    DateTime EndTime,
    decimal TotalAmount,
    ReservationStatus Status
);
