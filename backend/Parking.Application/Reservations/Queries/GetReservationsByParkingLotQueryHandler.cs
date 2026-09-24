using MediatR;
using Parking.Application.Reservations.DTOs;
using Parking.Domain.Interfaces;

namespace Parking.Application.Reservations.Queries;

public class GetReservationsByParkingLotQueryHandler : IRequestHandler<GetReservationsByParkingLotQuery, IEnumerable<ReservationDto>>
{
    private readonly IReservationRepository _repository;

    public GetReservationsByParkingLotQueryHandler(IReservationRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ReservationDto>> Handle(GetReservationsByParkingLotQuery request, CancellationToken cancellationToken)
    {
        var reservations = await _repository.GetByParkingLotIdAsync(request.ParkingLotId, cancellationToken);
        
        return reservations.Select(r => new ReservationDto(
            r.Id,
            r.ParkingLotId,
            r.UserId,
            r.LicensePlate,
            r.StartTime,
            r.EndTime,
            r.TotalAmount,
            r.Status
        ));
    }
}
