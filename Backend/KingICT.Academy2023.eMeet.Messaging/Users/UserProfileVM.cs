using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Messaging.Users
{
	public class UserProfileVM
	{
		public int Id { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
        public string Email { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string PhoneNumber { get; set; }
		public List<int> UserPreferenceIDs { get; set; }
		public string Description { get; set; }
        public string PictureURL { get; set; }
	}
}
