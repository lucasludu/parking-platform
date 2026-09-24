using MediatR;
using Parking.Application.Auth.DTOs;
using Parking.Domain.Enums;

namespace Parking.Application.Auth.Commands;

public record RegisterUserCommand(
    string Name,
    string Email,
    string Password,
    UserRole Role
) : IRequest<AuthResponseDto>;
