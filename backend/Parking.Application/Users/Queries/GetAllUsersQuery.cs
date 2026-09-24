using MediatR;
using Parking.Application.Auth.DTOs;
using Parking.Domain.Interfaces;

namespace Parking.Application.Users.Queries;

public record GetAllUsersQuery() : IRequest<List<UserDto>>;

public record UserDto(Guid Id, string Name, string Email, string Role);

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly IUserRepository _repository;

    public GetAllUsersQueryHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _repository.GetAllAsync(cancellationToken);
        return users.Select(u => new UserDto(u.Id, u.Name, u.Email, u.Role.ToString())).ToList();
    }
}
