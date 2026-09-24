namespace Parking.Application.Auth.DTOs;

public record AuthResponseDto(
    string Token,
    Guid UserId,
    string Name,
    string Role
);
