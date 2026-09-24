using MediatR;
using Parking.Domain.Entities;
using Parking.Domain.Interfaces;

namespace Parking.Application.Reservations.Queries;

public record GetAllReservationsQuery() : IRequest<List<Reservation>>;

public class GetAllReservationsQueryHandler : IRequestHandler<GetAllReservationsQuery, List<Reservation>>
{
    private readonly IReservationRepository _repository;

    public GetAllReservationsQueryHandler(IReservationRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Reservation>> Handle(GetAllReservationsQuery request, CancellationToken cancellationToken)
    {
        var all = await _repository.GetAllAsync(cancellationToken);
        return all.ToList();
    }
}
