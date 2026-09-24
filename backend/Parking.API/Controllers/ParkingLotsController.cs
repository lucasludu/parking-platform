using MediatR;
using Microsoft.AspNetCore.Mvc;
using Parking.Application.ParkingLots.Commands;
using Parking.Application.ParkingLots.Queries;

using Microsoft.AspNetCore.Authorization;

namespace Parking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ParkingLotsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ParkingLotsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllParkingLotsQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateParkingLotCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateParkingLotCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id) return BadRequest("ID mismatch");

        var result = await _mediator.Send(command, cancellationToken);
        if (!result) return NotFound();

        return NoContent();
    }
}
