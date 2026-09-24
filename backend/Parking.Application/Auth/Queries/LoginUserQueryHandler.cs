using MediatR;
using Parking.Application.Auth.DTOs;
using Parking.Application.Auth.Interfaces;
using Parking.Domain.Interfaces;

namespace Parking.Application.Auth.Queries;

public class LoginUserQueryHandler : IRequestHandler<LoginUserQuery, AuthResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public LoginUserQueryHandler(IUserRepository userRepository, IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> Handle(LoginUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new Exception("Invalid credentials.");
        }

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponseDto(token, user.Id, user.Name, user.Role.ToString());
    }
}
