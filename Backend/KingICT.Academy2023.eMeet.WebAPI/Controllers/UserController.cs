using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Infrastructure.Cryptography;
using KingICT.Academy2023.eMeet.Infrastructure.MailUtility;
using KingICT.Academy2023.eMeet.Messaging.Preferences;
using KingICT.Academy2023.eMeet.Messaging.Users;
using KingICT.Academy2023.eMeet.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace KingICT.Academy2023.eMeet.WebAPI.Controllers
{
	//[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class UserController : ControllerBase
	{
		private readonly IUserService _userService;
		private readonly IConfiguration _configuration;
		private readonly JwtProvider _jwtProvider;

		public UserController(IUserService userService, IConfiguration configuration, JwtProvider jwtProvider)
		{
			_userService = userService;
			_configuration = configuration;
			_jwtProvider = jwtProvider;
		}

		[HttpGet]
		[Route("GetUserDetailsByUserId")]
		public async Task<IActionResult> GetUserDetailsByUserId(int iduser)
		{
			try
			{
				var user = await _userService.GetUserDetailsByUserId(iduser);
				if (user == null)
					return NotFound("User doesn't have any workshops.");

				return Ok(user);
			}
			catch (ArgumentException ex)
			{
				return BadRequest(ex.Message);
			}
			catch (KeyNotFoundException) { return NotFound(); }
			catch (Exception) { return StatusCode(500, "An unexpected error occurred."); }
		}

		[HttpGet]
		[Route("GetAllInstructors")]
		public async Task<ActionResult<List<UserDTO>>> GetAllInstructors()
		{
			try
			{
				var instructors = await _userService.GetAllInstructors();
				if (instructors == null || !instructors.Any())
				{
					return NotFound("No instructors found.");
				}

				return Ok(instructors);
			}
			catch (Exception)
			{
				return StatusCode(500, "An unexpected error occurred.");
			}
		}

		[HttpGet]
		[Route("GetAllUsers")]
		public async Task<ActionResult<List<UserDTO>>> GetAllUsers()
		{
			try
			{
				var users = await _userService.GetAllUsers();
				if (users == null || !users.Any())
				{
					return NotFound("No users found.");
				}

				return Ok(users);
			}
			catch (Exception)
			{
				return StatusCode(500, "An unexpected error occurred.");
			}
		}

		[HttpGet]
		[Route("GetUserByEmail")]
		public async Task<IActionResult> GetUserByEmail(string email)
		{
			try
			{
				var user = await _userService.GetUserByEmail(email);
				if (user == null)
					return NotFound("User with the specified email doesn't exist");

				return Ok(user);
			}
			catch (ArgumentException ex)
			{
				if (ex.Message == "The email address is not in a valid format.")
					return BadRequest(ex.Message);
				else
					return BadRequest("Email is required.");
			}
			catch (KeyNotFoundException) { return NotFound(); }
			catch (Exception) { return StatusCode(500, "An unexpected error occurred."); }
		}

		[HttpGet]
		[Route("GetUserProfileDetailsById")]
		public async Task<IActionResult> GetUserProfileDetailsById(int id)
		{
			try
			{
				var user = await _userService.GetUserProfileDetailsById(id);
				if (user == null)
					return NotFound("User with the specified id doesn't exist");

				return Ok(user);
			}
			catch (ArgumentException ex)
			{
					return BadRequest("Id is required.");
			}
			catch (KeyNotFoundException) { return NotFound(); }
			catch (Exception) { return StatusCode(500, "An unexpected error occurred."); }
		}

		[AllowAnonymous]
		[HttpPost("Login")]
		public async Task<IActionResult> Login(UserLoginRequest loginRequest)
		{
			if (loginRequest == null)
			{
				return BadRequest("Invalid client request");
			}

			try
			{
				UserDTO loggedInUser = await _userService.UserLogin(loginRequest);

				if (loggedInUser != null)
				{
					var token = _jwtProvider.GenerateJwtToken(loggedInUser);
					return Ok(new
					{
						status = "Login successful",
						user = loggedInUser,
						token
					});
				}
				else
					return Unauthorized("Login failed, please check your email and password.");

			}
			catch (ArgumentException ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[AllowAnonymous]
		[HttpPost("Register")]
		public async Task<IActionResult> Register(UserRegisterRequest registerRequest)
		{
			if (registerRequest == null)
			{
				return BadRequest("Invalid client request");
			}

			try
			{
				UserDTO registeredUser = await _userService.UserRegister(registerRequest);

				if (registeredUser != null)
				{
					return Ok(new
					{
						status = "Please confirm your email",
						user = registeredUser
					});
				}
				else
				{
					return BadRequest("Registration failed. User might already exist.");
				}
			}
			catch (InvalidOperationException ex)
			{
				return BadRequest(ex.Message);
			}
			catch (ArgumentException ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[AllowAnonymous]
		[HttpGet("confirm-email")]
		public async Task<IActionResult> ConfirmEmail(string token)
		{
			try
			{
				if (string.IsNullOrEmpty(token))
					return BadRequest("Invalid token (Empty token).");

				bool verificationSuccess = await _userService.ConfirmEmail(token);
				if (!verificationSuccess)
					return BadRequest("Invalid token.");

				return Ok("Email confirmed successfully.");
			}
			catch (InvalidOperationException ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[AllowAnonymous]
		[HttpPost("ForgotPassword")]
		public async Task<IActionResult> ForgotPassword(string email)
		{
			if (string.IsNullOrWhiteSpace(email))
				return BadRequest("Email is required.");

			try
			{
				bool isResetInitiated = await _userService.InitiatePasswordReset(email);

				if (isResetInitiated)
					return Ok("Password reset instructions sent to your email. Please check your inbox.");

				else
					return BadRequest("Failed to send password reset instructions. Email may not exist or there was an internal error.");

			}
			catch (InvalidOperationException ex)
			{
				return BadRequest(ex.Message);
			}
			catch (ArgumentException ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[AllowAnonymous]
		[HttpGet("reset-password")]
		public async Task<IActionResult> ResetPassword(string token)
		{
			var user = await _userService.GetUserByPasswordResetToken(token);

			if (user == null)
				return BadRequest("Invalid token.");

			return Ok("Please set your new password.");
		}

		[AllowAnonymous]
		[HttpGet("ChangePassword")]
		public async Task<IActionResult> ChangePassword(string email, string newPassword)
		{
			var user = await _userService.GetUserByEmail(email);

			if (user == null)
				return BadRequest("User with the given email doesn't exist.");
			if (newPassword == null)
				return BadRequest("Please provide a valid password.");

			

			var passwordChangeSuccess = await _userService.ChangePassword(email, newPassword);
			if (passwordChangeSuccess)
				return Ok("Sucessfully changed the password.");
			else
				return BadRequest("Failed to change the password");
		}


		

		[HttpPut("{id}")]
		public async Task<IActionResult> Update(int id, [FromBody] UserProfileVM user)
		{
			if (id != user.Id)
			{
				return BadRequest("ID in URL does not match ID in payload.");
			}

			try
			{
				await _userService.UpdateUserDetails(user);
				return StatusCode(200, "User updated successfully!");
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}

	}

}

