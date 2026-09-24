using MediatR;
using Parking.Application.Reservations.DTOs;

namespace Parking.Application.Reservations.Queries;

public record GetReservationsByParkingLotQuery(Guid ParkingLotId) : IRequest<IEnumerable<ReservationDto>>;
