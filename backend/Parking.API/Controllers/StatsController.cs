using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Parking.Application.Stats.Queries;

namespace Parking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class StatsController : ControllerBase
{
    private readonly IMediator _mediator;

    public StatsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetDashboardStatsQuery(), cancellationToken);
        return Ok(result);
    }
}
