using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Messaging.Users
{
	public class UserRegisterRequest
	{
		public UserRegisterRequest(string firstName, string lastName, string email, string password, string confirmPassword, string phoneNumber, int comboboxPreference)
		{
			FirstName = firstName;
			LastName = lastName;
			Email = email;
			Password = password;
			ConfirmPassword = confirmPassword;
			PhoneNumber = phoneNumber;
			ComboboxPreference = comboboxPreference;
		}

		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
		public string ConfirmPassword { get; set; }
		public string PhoneNumber { get; set; }
		public int ComboboxPreference { get; set; } // DEV, QA, BA [Interno]
	}
}
