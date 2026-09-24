using MediatR;
using Parking.Domain.Entities;
using Parking.Domain.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace Parking.Application.ParkingLots.Commands;

public record UpdateParkingLotCommand(
    Guid Id,
    string Name,
    string Address,
    int TotalSpots,
    decimal PricePerHour,
    double Latitude,
    double Longitude
) : IRequest<bool>;

public class UpdateParkingLotCommandHandler : IRequestHandler<UpdateParkingLotCommand, bool>
{
    private readonly IParkingLotRepository _repository;
    private readonly IDistributedCache _cache;

    public UpdateParkingLotCommandHandler(IParkingLotRepository repository, IDistributedCache cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<bool> Handle(UpdateParkingLotCommand request, CancellationToken cancellationToken)
    {
        var lot = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (lot == null) return false;

        lot.Name = request.Name;
        lot.Address = request.Address;
        lot.TotalSpots = request.TotalSpots;
        lot.PricePerHour = request.PricePerHour;
        lot.Latitude = request.Latitude;
        lot.Longitude = request.Longitude;

        await _repository.UpdateAsync(lot, cancellationToken);

        await _cache.RemoveAsync("AvailableParkingLots", cancellationToken);

        return true;
    }
}
