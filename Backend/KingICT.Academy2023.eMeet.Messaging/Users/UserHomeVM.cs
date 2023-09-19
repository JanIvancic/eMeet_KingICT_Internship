using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Messaging.Users
{
    public class UserHomeVM
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Role { get; set; }
        public List<int> UserPreferenceIDs { get; set; }
        public List<int> SignedUpWorkshopIDs { get; set; }
    }
}
