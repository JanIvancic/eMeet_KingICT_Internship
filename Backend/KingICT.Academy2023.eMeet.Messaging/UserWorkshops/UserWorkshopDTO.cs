using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Messaging.UserWorkshops
{
	public class UserWorkshopDTO
	{
		public int Id { get; set; }
		public byte AttendanceType { get; set; }
		public bool IsHost { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public string PhoneNumber { get; set; }
		public int Role { get; set; }
		public bool Deleted { get; set; }

	}
}
