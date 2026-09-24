using MediatR;
using Parking.Application.Reservations.DTOs;

namespace Parking.Application.Reservations.Commands;

public record CreateReservationCommand(
    Guid ParkingLotId,
    Guid UserId,
    string LicensePlate,
    DateTime StartTime,
    DateTime EndTime
) : IRequest<ReservationDto>;
