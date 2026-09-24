using MediatR;
using Parking.Application.ParkingLots.DTOs;
using Parking.Domain.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace Parking.Application.ParkingLots.Queries;

public class GetAllParkingLotsQueryHandler : IRequestHandler<GetAllParkingLotsQuery, IEnumerable<ParkingLotDto>>
{
    private readonly IParkingLotRepository _repository;
    private readonly IDistributedCache _cache;
    private const string CacheKey = "AvailableParkingLots";

    public GetAllParkingLotsQueryHandler(IParkingLotRepository repository, IDistributedCache cache)
    {
        _repository = repository;
        _cache = cache;
    }

    public async Task<IEnumerable<ParkingLotDto>> Handle(GetAllParkingLotsQuery request, CancellationToken cancellationToken)
    {
        var cachedData = await _cache.GetStringAsync(CacheKey, cancellationToken);
        if (!string.IsNullOrEmpty(cachedData))
        {
            var cachedParkingLots = JsonSerializer.Deserialize<IEnumerable<ParkingLotDto>>(cachedData);
            if (cachedParkingLots != null)
            {
                return cachedParkingLots;
            }
        }

        var parkingLots = await _repository.GetAllAsync(cancellationToken);
        
        var dtos = parkingLots.Select(p => new ParkingLotDto(
            p.Id,
            p.Name,
            p.Address,
            p.TotalSpots,
            p.PricePerHour,
            p.Latitude,
            p.Longitude
        )).ToList();

        var cacheOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
        };

        await _cache.SetStringAsync(CacheKey, JsonSerializer.Serialize(dtos), cacheOptions, cancellationToken);

        return dtos;
    }
}
