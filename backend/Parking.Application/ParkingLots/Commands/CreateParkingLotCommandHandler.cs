using MediatR;
using Parking.Application.ParkingLots.DTOs;
using Parking.Domain.Entities;
using Parking.Domain.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace Parking.Application.ParkingLots.Commands;

public class CreateParkingLotCommandHandler : IRequestHandler<CreateParkingLotCommand, ParkingLotDto>
{
    private readonly IParkingLotRepository _repository;
    private readonly IDistributedCache _cache;

    public CreateParkingLotCommandHandler(IParkingLotRepository repository, IDistributedCache cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<ParkingLotDto> Handle(CreateParkingLotCommand request, CancellationToken cancellationToken)
    {
        var parkingLot = new ParkingLot
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Address = request.Address,
            TotalSpots = request.TotalSpots,
            PricePerHour = request.PricePerHour,
            Latitude = request.Latitude,
            Longitude = request.Longitude
        };

        await _repository.AddAsync(parkingLot, cancellationToken);
        
        await _cache.RemoveAsync("AvailableParkingLots", cancellationToken);

        return new ParkingLotDto(
            parkingLot.Id,
            parkingLot.Name,
            parkingLot.Address,
            parkingLot.TotalSpots,
            parkingLot.PricePerHour,
            parkingLot.Latitude,
            parkingLot.Longitude
        );
    }
}
