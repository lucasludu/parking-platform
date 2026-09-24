using Parking.Domain.Entities;

namespace Parking.Application.Auth.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
