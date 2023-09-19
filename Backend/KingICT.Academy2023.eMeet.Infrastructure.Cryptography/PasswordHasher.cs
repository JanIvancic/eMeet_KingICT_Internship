using System;
using Microsoft.AspNet.Identity;

namespace KingICT.Academy2023.eMeet.Infrastructure.Cryptography
{
	public class Passwordhasher
	{
		private readonly PasswordHasher _passwordHasher;

		public Passwordhasher()
		{
			_passwordHasher = new PasswordHasher();
		}

		public string HashPassword(string password)
		{
			if (string.IsNullOrEmpty(password))
			{
				throw new ArgumentNullException(nameof(password));
			}

			return _passwordHasher.HashPassword(password);
		}

		public bool VerifyPassword(string hashedPassword, string providedPassword)
		{
			if (string.IsNullOrEmpty(hashedPassword))
			{
				throw new ArgumentNullException(nameof(hashedPassword));
			}

			if (string.IsNullOrEmpty(providedPassword))
			{
				throw new ArgumentNullException(nameof(providedPassword));
			}

			PasswordVerificationResult result = _passwordHasher.VerifyHashedPassword(hashedPassword, providedPassword);

			return result == PasswordVerificationResult.Success;
		}
	}
}
