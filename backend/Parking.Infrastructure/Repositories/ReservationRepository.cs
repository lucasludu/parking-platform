using Microsoft.EntityFrameworkCore;
using Parking.Domain.Entities;
using Parking.Domain.Enums;
using Parking.Domain.Interfaces;
using Parking.Infrastructure.Data;

namespace Parking.Infrastructure.Repositories;

public class ReservationRepository : IReservationRepository
{
    private readonly ApplicationDbContext _context;

    public ReservationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetActiveReservationsCountAsync(Guid parkingLotId, DateTime startTime, DateTime endTime, CancellationToken cancellationToken = default)
    {
        return await _context.Reservations
            .Where(r => r.ParkingLotId == parkingLotId 
                     && r.Status != ReservationStatus.Cancelled
                     && r.StartTime < endTime 
                     && r.EndTime > startTime)
            .CountAsync(cancellationToken);
    }

    public async Task<IEnumerable<Reservation>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Reservations.ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Reservation>> GetByParkingLotIdAsync(Guid parkingLotId, CancellationToken cancellationToken = default)
    {
        return await _context.Reservations
            .Where(r => r.ParkingLotId == parkingLotId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Reservation reservation, CancellationToken cancellationToken = default)
    {
        await _context.Reservations.AddAsync(reservation, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
