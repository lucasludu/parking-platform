using Parking.Domain.Entities;
using Parking.Domain.Enums;

namespace Parking.Domain.Interfaces;

public interface IReservationRepository
{
    Task<int> GetActiveReservationsCountAsync(Guid parkingLotId, DateTime startTime, DateTime endTime, CancellationToken cancellationToken = default);
    Task<IEnumerable<Reservation>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Reservation>> GetByParkingLotIdAsync(Guid parkingLotId, CancellationToken cancellationToken = default);
    Task AddAsync(Reservation reservation, CancellationToken cancellationToken = default);
}
