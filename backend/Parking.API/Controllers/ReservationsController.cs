using MediatR;
using Microsoft.AspNetCore.Mvc;
using Parking.Application.Reservations.Commands;
using Parking.Application.Reservations.Queries;

using Microsoft.AspNetCore.Authorization;

namespace Parking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReservationsController(IMediator mediator)
    {
        _mediator = mediator;
    }



    [HttpPost]
    [Authorize(Roles = "Driver")]
    public async Task<IActionResult> Create([FromBody] CreateReservationCommand command, CancellationToken cancellationToken)
    {
        try 
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized();
            }

            var secureCommand = command with { UserId = userId };
            var result = await _mediator.Send(secureCommand, cancellationToken);
            return CreatedAtAction(nameof(GetByParkingLot), new { parkingLotId = command.ParkingLotId }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllReservationsQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("lot/{parkingLotId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetByParkingLot(Guid parkingLotId, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetReservationsByParkingLotQuery(parkingLotId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize(Roles = "Driver")]
    public async Task<IActionResult> GetMyReservations(CancellationToken cancellationToken)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
        {
            return Unauthorized();
        }

        var result = await _mediator.Send(new GetReservationsByUserQuery(userId), cancellationToken);
        return Ok(result);
    }
}
