using Parking.Domain.Entities;

namespace Parking.Domain.Interfaces;

public interface IParkingLotRepository
{
    Task<IEnumerable<ParkingLot>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ParkingLot?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(ParkingLot parkingLot, CancellationToken cancellationToken = default);
    Task UpdateAsync(ParkingLot parkingLot, CancellationToken cancellationToken = default);
}
