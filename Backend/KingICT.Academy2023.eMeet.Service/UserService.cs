using Azure.Core;
using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Infrastructure.Cryptography;
using KingICT.Academy2023.eMeet.Infrastructure.MailUtility;
using KingICT.Academy2023.eMeet.Messaging.Preferences;
using KingICT.Academy2023.eMeet.Messaging.Users;
using KingICT.Academy2023.eMeet.Model.Configuration;
using KingICT.Academy2023.eMeet.Model.Enums;
using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using KingICT.Academy2023.eMeet.Repository.Repositories;
using Microsoft.AspNet.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;

namespace KingICT.Academy2023.eMeet.Service
{
	public class UserService : IUserService
	{

		private readonly IUserRepository _userRepository;
		private readonly IUserPreferenceRepository _userPreferenceRepository;
		private readonly Passwordhasher _passwordHasher;
		private readonly MailUtility _mailUtility;
		private readonly WebAppSettings _webAppSettings;
		private readonly IWorkshopRepository _workshopRepository;

		public UserService(IUserRepository userRepository, Passwordhasher passwordHasher, MailUtility mailUtility, IOptions<WebAppSettings> webAppSettingsOptions, IUserPreferenceRepository userPreferenceRepository, IWorkshopRepository workshopRepository)
		{
			_userRepository = userRepository;
			_passwordHasher = passwordHasher;
			_mailUtility = mailUtility;
			_webAppSettings = webAppSettingsOptions.Value;
			_userPreferenceRepository = userPreferenceRepository;
			_workshopRepository = workshopRepository;
		}

		public async Task<UserProfileVM> UpdateUserDetails(UserProfileVM user)
		{
			var updatedUser = await _userRepository.GetUserByEmail(user.Email);
			if (updatedUser == null)
			{
				throw new ArgumentException("User doesnt exist");
			}

			var updatedUserPreferences = user.UserPreferenceIDs.Select(prefId => new UserPreference
			{
				UserId = user.Id,
				PreferenceId = prefId
			}).ToList();


			updatedUser.FirstName = user.FirstName;
			updatedUser.LastName = user.LastName;
			updatedUser.PhoneNumber = user.PhoneNumber;
			updatedUser.PictureURL = user.PictureURL;
			updatedUser.Description = user.Description;
			updatedUser.Email = user.Email; //Cant change email
			updatedUser.Password = _passwordHasher.HashPassword(user.NewPassword);
			updatedUser.PhoneNumber = user.PhoneNumber;


			await _userRepository.Update(updatedUser);
			await _userPreferenceRepository.DeleteByUserId(user.Id);
			foreach (var userPreference in updatedUserPreferences)
			{
				await _userPreferenceRepository.Insert(userPreference);
			}

			var preferenceIds = updatedUserPreferences.Select(up => up.PreferenceId).ToList();

			UserProfileVM userProfileDTO = new UserProfileVM
			{
				Id = updatedUser.IdUser,
				FirstName = updatedUser.FirstName,
				LastName = updatedUser.LastName,
				Email = updatedUser.Email,
				Description = updatedUser.Description,
				PhoneNumber = updatedUser.PhoneNumber,
				PictureURL = updatedUser.PictureURL,
				UserPreferenceIDs = preferenceIds,
			};

			return userProfileDTO;
		}

		public async Task<UserHomeVM> GetUserDetailsByUserId(int userId)
		{
			var user = await _userRepository.GetById(userId);
			if (user == null) throw new KeyNotFoundException($"User with ID {userId} not found.");

			var userPreferences = await _userPreferenceRepository.GetByUserId(userId);

			var userHomeVM = new UserHomeVM
			{
				Id = user.IdUser,
				Email = user.Email,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Role = (int)user.Role,

				UserPreferenceIDs = (await _userPreferenceRepository.GetByUserId(userId))
				.Select(up => up.PreferenceId)
									.ToList(),
				SignedUpWorkshopIDs = (await _workshopRepository.GetByUserId(userId))
									.Select(w => w.IdWorkshop)
									.ToList()
			};

			return userHomeVM;
		}

		public async Task<UserProfileVM> GetUserProfileDetailsById(int id)
		{
			if (id == 0)
				throw new ArgumentNullException(nameof(id));

			var user = await _userRepository.GetUserProfileDetailsById(id);
			var userPreferences = await _userPreferenceRepository.GetByUserId(id);

			var UserProfileVM = new UserProfileVM
			{
				Id = user.IdUser,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Email = user.Email,
				PhoneNumber = user.PhoneNumber,
				UserPreferenceIDs = (await _userPreferenceRepository.GetByUserId(user.IdUser))
				.Select(up => up.PreferenceId)
									.ToList(),
				Description = user.Description,
				PictureURL = user.PictureURL,
			};

			return UserProfileVM;
		}

		public bool IsValidEmail(string email)
		{
			return new EmailAddressAttribute().IsValid(email);
		}

		public async Task<UserDTO> GetUserByEmail(string email)
		{
			if (string.IsNullOrEmpty(email))
				throw new ArgumentNullException(nameof(email));

			if (!IsValidEmail(email))
				throw new ArgumentException("The email address is not in a valid format.");

			var user = await _userRepository.GetUserByEmail(email);

			if (user == null)
				throw new ArgumentException("Incorrect Email or Password");

			var userDTO = new UserDTO
			{
				Id = user.IdUser,
				Email = user.Email,
				FirstName = user.FirstName,
				LastName = user.LastName
			};

			return userDTO;
		}

		public async Task<UserDTO> UserLogin(UserLoginRequest request)
		{
			if (string.IsNullOrEmpty(request.Email))
				throw new ArgumentNullException(nameof(request.Email));

			if (string.IsNullOrEmpty(request.Password))
				throw new ArgumentNullException(nameof(request.Password));

			if (!IsValidEmail(request.Email))
				throw new ArgumentException("The email address is not in a valid format.");

			User user = await _userRepository.GetUserByEmail(request.Email);

			if (user == null || !VerifyPassword(request.Password, user.Password))
				throw new ArgumentException("Login Error: Incorrect Email or Password");
			if (!user.IsVerified)
				throw new ArgumentException("Login Error: Confirm your email before signing in!");

			var loggedInUser = new UserDTO
			{
				Id = user.IdUser,
				Email = request.Email,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Role = user.Role,
			};

			return loggedInUser;
		}

		private bool VerifyPassword(string password, string storedHash)
		{
			return _passwordHasher.VerifyPassword(storedHash, password);
		}
		public async Task<UserDTO> UserRegister(UserRegisterRequest request)
		{

			if (request.Password != request.ConfirmPassword)
				throw new InvalidOperationException("Passwords don't match");

			var existingUser = await _userRepository.GetUserByEmail(request.Email);

			if (existingUser != null)
				throw new InvalidOperationException("User with the same email already exists.");

			var userPassword = _passwordHasher.HashPassword(request.Password);

			string emailConfirmationToken = Guid.NewGuid().ToString();


			User newUser = null;

			if (request.Email.EndsWith("@harakirimail.com") || request.Email.EndsWith("@king-ict.eu"))
			{
				newUser = new User(request.FirstName, request.LastName, request.Email, UserRoleEnum.Admin, userPassword, request.PhoneNumber, false, emailConfirmationToken);
			}
			else
			{
				newUser = new User(request.FirstName, request.LastName, request.Email, UserRoleEnum.Public, userPassword, request.PhoneNumber, false, emailConfirmationToken);
			}

			await _userRepository.Insert(newUser);

			var userFromDb = await _userRepository.GetUserByEmail(newUser.Email);
			var newUserPreference = new UserPreference(userFromDb.IdUser, request.ComboboxPreference);
			await _userPreferenceRepository.Insert(newUserPreference);

			//if in development -> localhost
			//else in production -> azure.web.app...
			string confirmLink = $"{_webAppSettings.BaseUrl}/api/User/confirm-email?token={emailConfirmationToken}";

			var templateParams = new Dictionary<string, object>
					 {
						{ "FIRSTNAME", newUser.FirstName },
						{ "VERIFICATION_LINK", confirmLink }
					 };


			await _mailUtility.SendEmailUsingTemplate(newUser.Email, 1, templateParams);

			var registeredUser = new UserDTO
			{
				Id = newUser.IdUser,
				Email = newUser.Email,
				FirstName = newUser.FirstName,
				LastName = newUser.LastName,
				Role = newUser.Role
			};

			return registeredUser;
		}

		public async Task<bool> ConfirmEmail(string token)
		{
			var newUser = await _userRepository.GetUserByRegistrationToken(token);
			if (newUser == null)
				return false;
			if (newUser.IsVerified)
				throw new InvalidOperationException("Email is already verified");
			else
			{
				newUser.IsVerified = true;
				await _userRepository.Update(newUser);
				return true;
			}
		}

		public async Task<bool> InitiatePasswordReset(string email)
		{
			string passwordResetConfirmationToken = Guid.NewGuid().ToString();

			var user = await _userRepository.GetUserByEmail(email);
			if (user == null)
				return false;
			user.ResetPasswordToken = passwordResetConfirmationToken;
			await _userRepository.Update(user);

			//if in development -> localhost
			//else in production -> azure.web.app...
			string confirmLink = $"{_webAppSettings.BaseUrl}/reset-password?token={passwordResetConfirmationToken}";

			var templateParams = new Dictionary<string, object>
					 {
						{ "FIRSTNAME", user.FirstName },
						{ "VERIFICATION_LINK", confirmLink }
					 };


			await _mailUtility.SendEmailUsingTemplate(email, 2, templateParams);

			return true;
		}

		public async Task<UserDTO> GetUserByPasswordResetToken(string token)
		{
			if (token == null)
				throw new ArgumentException("Invalid token (Empty token)");

			var user = await _userRepository.GetUserByResetPasswordToken(token);
			//user.ResetPasswordToken = null;
			//await _userRepository.Update(user);

			if (user == null)
				throw new ArgumentException("Invalid token");

			var userDTO = new UserDTO
			{
				Id = user.IdUser,
				Email = user.Email,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Role = user.Role
			};

			return userDTO;
		}

		public async Task<bool> ChangePassword(string email, string newPassword)
		{
			var user = await _userRepository.GetUserByEmail(email);

			var userPassword = _passwordHasher.HashPassword(newPassword);

			user.Password = userPassword;
			user.ResetPasswordToken = null;
			await _userRepository.Update(user);

			return true;
		}

		public async Task<List<UserProfileVM>> GetAllInstructors()
		{
			var users = await _userRepository.GetAllInstructors();

			List<UserProfileVM> userDTOs = new List<UserProfileVM>();

			foreach (var u in users)
			{
				var userPreferenceIDs = (await _userPreferenceRepository.GetByUserId(u.IdUser))
										.Select(up => up.PreferenceId)
										.ToList();

				userDTOs.Add(new UserProfileVM
				{
					Id = u.IdUser,
					FirstName = u.FirstName,
					LastName = u.LastName,
					Email = u.Email,
					Description = u.Description,
					PhoneNumber = u.PhoneNumber,
					PictureURL = u.PictureURL,
					UserPreferenceIDs = userPreferenceIDs
				});
			}

			return userDTOs;
		}

		public async Task<List<UserProfileVM>> GetAllUsers()
		{
			var users = await _userRepository.GetAllUsers();

			List<UserProfileVM> userDTOs = new List<UserProfileVM>();

			foreach (var u in users)
			{
				var userPreferenceIDs = (await _userPreferenceRepository.GetByUserId(u.IdUser))
										.Select(up => up.PreferenceId)
										.ToList();

				userDTOs.Add(new UserProfileVM
				{
					Id = u.IdUser,
					FirstName = u.FirstName,
					LastName = u.LastName,
					Email = u.Email,
					Description = u.Description,
					PhoneNumber = u.PhoneNumber,
					PictureURL = u.PictureURL,
					UserPreferenceIDs = userPreferenceIDs
				});
			}

			return userDTOs;
		}
		public async Task Delete(object id)
		{
			if (id == null)
				throw new ArgumentNullException(nameof(id));

			var user = await _userRepository.GetById(id);
			if (user == null)
				throw new KeyNotFoundException($"User with ID {id} not found.");

			await _userRepository.Delete(user);
		}



		public async Task<List<UserDTO>> GetAll()
		{
			var users = await _userRepository.GetAll();

			var userDTOs = users.Select(u => new UserDTO
			{
				Id = u.IdUser,
				FirstName = u.FirstName,
				LastName = u.LastName,
				Email = u.Email,
				Role = (int)u.Role
			}).ToList();

			return userDTOs;
		}

		public async Task<UserDTO> GetById(object id)
		{
			var user = await _userRepository.GetById(id);

			if (user == null)
				return null;

			return new UserDTO
			{
				Id = user.IdUser,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Email = user.Email
			};
		}

		public async Task Insert(UserDTO entity)
		{
			if (entity == null)
				throw new ArgumentNullException(nameof(entity));

			var user = new User
			{
				IdUser = entity.Id,
				FirstName = entity.FirstName,
				LastName = entity.LastName,
				Email = entity.Email

			};

			await _userRepository.Insert(user);
		}

		public async Task Update(UserDTO entity)
		{
			if (entity == null)
				throw new ArgumentNullException(nameof(entity));

			var user = await _userRepository.GetById(entity.Id);
			if (user == null)
				throw new KeyNotFoundException($"User with ID {entity.Id} not found.");

			user.FirstName = entity.FirstName;
			user.LastName = entity.LastName;
			//user.Email = entity.Email; Can't change the email!

			await _userRepository.Update(user);
		}


	}
}
