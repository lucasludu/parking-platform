using MediatR;
using Parking.Application.Reservations.DTOs;
using Parking.Domain.Interfaces;

namespace Parking.Application.Reservations.Queries;

public record GetReservationsByUserQuery(Guid UserId) : IRequest<IEnumerable<ReservationDto>>;

public class GetReservationsByUserQueryHandler : IRequestHandler<GetReservationsByUserQuery, IEnumerable<ReservationDto>>
{
    private readonly IReservationRepository _repository;

    public GetReservationsByUserQueryHandler(IReservationRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ReservationDto>> Handle(GetReservationsByUserQuery request, CancellationToken cancellationToken)
    {
        var all = await _repository.GetAllAsync(cancellationToken);
        return all
            .Where(r => r.UserId == request.UserId)
            .Select(r => new ReservationDto(
                r.Id,
                r.ParkingLotId,
                r.UserId,
                r.LicensePlate,
                r.StartTime,
                r.EndTime,
                r.TotalAmount,
                r.Status
            )).ToList();
    }
}
