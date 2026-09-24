using MediatR;
using Parking.Application.Auth.DTOs;
using Parking.Application.Auth.Interfaces;
using Parking.Domain.Entities;
using Parking.Domain.Interfaces;

namespace Parking.Application.Auth.Commands;

public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, AuthResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public RegisterUserCommandHandler(IUserRepository userRepository, IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (existingUser != null)
        {
            throw new Exception("Email already exists.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role
        };

        await _userRepository.AddAsync(user, cancellationToken);

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponseDto(token, user.Id, user.Name, user.Role.ToString());
    }
}
