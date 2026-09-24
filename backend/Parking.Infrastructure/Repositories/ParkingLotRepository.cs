using Microsoft.EntityFrameworkCore;
using Parking.Domain.Entities;
using Parking.Domain.Interfaces;
using Parking.Infrastructure.Data;

namespace Parking.Infrastructure.Repositories;

public class ParkingLotRepository : IParkingLotRepository
{
    private readonly ApplicationDbContext _context;

    public ParkingLotRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ParkingLot>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        
        return await _context.ParkingLots.ToListAsync(cancellationToken);
    }

    public async Task<ParkingLot?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.ParkingLots.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task AddAsync(ParkingLot parkingLot, CancellationToken cancellationToken = default)
    {
        await _context.ParkingLots.AddAsync(parkingLot, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(ParkingLot parkingLot, CancellationToken cancellationToken = default)
    {
        _context.ParkingLots.Update(parkingLot);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
