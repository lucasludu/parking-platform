using MediatR;
using Parking.Application.ParkingLots.DTOs;

namespace Parking.Application.ParkingLots.Queries;

public record GetAllParkingLotsQuery() : IRequest<IEnumerable<ParkingLotDto>>;
