using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Messaging.Users
{
	public class UserLoginRequest
	{
		public UserLoginRequest(string email, string password)
		{
			Email = email;
			Password = password;
		}

		public string Email { get; set; }
		public string Password { get; set; }
	}


}
