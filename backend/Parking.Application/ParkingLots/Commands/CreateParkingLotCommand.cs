using MediatR;
using Parking.Application.ParkingLots.DTOs;

namespace Parking.Application.ParkingLots.Commands;

public record CreateParkingLotCommand(
    string Name,
    string Address,
    int TotalSpots,
    decimal PricePerHour,
    double Latitude,
    double Longitude
) : IRequest<ParkingLotDto>;
