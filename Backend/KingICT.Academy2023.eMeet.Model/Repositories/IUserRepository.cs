using KingICT.Academy2023.eMeet.Messaging.Users;
using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Model.Repositories
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        Task<User> GetUserByEmail(string email);
        Task<User> GetUserByRegistrationToken(string token);
        Task<User> GetUserByResetPasswordToken(string token);
        Task<List<User>> GetAllInstructors();
		Task<List<User>> GetAllUsers();
		Task<User> GetUserProfileDetailsById(int id);
		
	}
}
