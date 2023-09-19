using KingICT.Academy2023.eMeet.Messaging.Users;

namespace KingICT.Academy2023.eMeet.Contract
{
    public interface IUserService
	{
		Task<UserDTO> GetUserByEmail(string email);
		Task<UserDTO> UserLogin(UserLoginRequest request);
		Task<UserDTO> UserRegister(UserRegisterRequest request);
		Task<bool> ConfirmEmail(string token);
		Task<bool> InitiatePasswordReset(string email);
		Task<UserDTO> GetUserByPasswordResetToken(string token);
		Task<bool> ChangePassword(string email, string newPassword);
		Task<List<UserProfileVM>> GetAllInstructors();
		Task<List<UserProfileVM>> GetAllUsers();
		Task<UserProfileVM> GetUserProfileDetailsById(int id);
		Task<UserHomeVM> GetUserDetailsByUserId(int userId);
		Task<UserProfileVM> UpdateUserDetails(UserProfileVM user);


		Task<List<UserDTO>> GetAll();
		Task<UserDTO> GetById(object id);
		Task Insert(UserDTO entity);
		Task Update(UserDTO entity);
		Task Delete(object id);
		
	}
}
