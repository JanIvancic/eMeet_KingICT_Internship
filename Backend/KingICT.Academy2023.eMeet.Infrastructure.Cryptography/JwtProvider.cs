using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using KingICT.Academy2023.eMeet.Messaging.Users;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace KingICT.Academy2023.eMeet.Infrastructure.Cryptography
{
	public class JwtProvider
	{
		private readonly IConfiguration _configuration;

		public JwtProvider(IConfiguration configuration)
		{
			_configuration = configuration;

			var jwtSettings = _configuration.GetSection("JwtSettings");
			Key = jwtSettings["Key"];
			Issuer = jwtSettings["Issuer"];
			Audience = jwtSettings["Audience"];
			DurationInMinutes = Convert.ToInt32(jwtSettings["DurationInMinutes"]);
		}

		public string Key { get; }
		public string Issuer { get; }
		public string Audience { get; }
		public int DurationInMinutes { get; }

		public string GenerateJwtToken(UserDTO user)
		{
			var key = Encoding.ASCII.GetBytes(Key);

			var claims = new List<Claim>
				{
					new Claim(ClaimTypes.Name, user.Email),
					new Claim(ClaimTypes.Role, user.Role.ToString()),
				};

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(claims),
				Expires = DateTime.UtcNow.AddMinutes(DurationInMinutes),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
				Issuer = Issuer,
				Audience = Audience
			};

			var tokenHandler = new JwtSecurityTokenHandler();
			var securityToken = tokenHandler.CreateToken(tokenDescriptor);
			var token = tokenHandler.WriteToken(securityToken);

			return token;
		}
	}
}
