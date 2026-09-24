using MediatR;
using Parking.Application.Auth.DTOs;

namespace Parking.Application.Auth.Queries;

public record LoginUserQuery(
    string Email,
    string Password
) : IRequest<AuthResponseDto>;
