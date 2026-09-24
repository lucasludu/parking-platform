using MediatR;
using Parking.Application.Reservations.DTOs;
using Parking.Domain.Entities;
using Parking.Domain.Enums;
using Parking.Domain.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace Parking.Application.Reservations.Commands;

public class CreateReservationCommandHandler : IRequestHandler<CreateReservationCommand, ReservationDto>
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IParkingLotRepository _parkingLotRepository;
    private readonly IDistributedCache _cache;

    public CreateReservationCommandHandler(IReservationRepository reservationRepository, IParkingLotRepository parkingLotRepository, IDistributedCache cache)
    {
        _reservationRepository = reservationRepository;
        _parkingLotRepository = parkingLotRepository;
        _cache = cache;
    }

    public async Task<ReservationDto> Handle(CreateReservationCommand request, CancellationToken cancellationToken)
    {
        if (request.StartTime >= request.EndTime)
        {
            throw new ArgumentException("StartTime must be before EndTime.");
        }

        var parkingLot = await _parkingLotRepository.GetByIdAsync(request.ParkingLotId, cancellationToken);
        if (parkingLot == null)
        {
            throw new Exception("Parking lot not found.");
        }

        var activeReservations = await _reservationRepository.GetActiveReservationsCountAsync(
            request.ParkingLotId, request.StartTime, request.EndTime, cancellationToken);

        if (activeReservations >= parkingLot.TotalSpots)
        {
            throw new Exception("Parking lot is fully booked for the selected time.");
        }

        var duration = (request.EndTime - request.StartTime).TotalHours;
        var totalAmount = (decimal)duration * parkingLot.PricePerHour;

        var reservation = new Reservation
        {
            Id = Guid.NewGuid(),
            ParkingLotId = request.ParkingLotId,
            UserId = request.UserId,
            LicensePlate = request.LicensePlate,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            TotalAmount = totalAmount,
            Status = ReservationStatus.Active
        };

        await _reservationRepository.AddAsync(reservation, cancellationToken);

        await _cache.RemoveAsync("AvailableParkingLots", cancellationToken);

        return new ReservationDto(
            reservation.Id,
            reservation.ParkingLotId,
            reservation.UserId,
            reservation.LicensePlate,
            reservation.StartTime,
            reservation.EndTime,
            reservation.TotalAmount,
            reservation.Status
        );
    }
}
