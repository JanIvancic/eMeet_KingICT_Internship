using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Messaging.UserWorkshops
{
    public class UserWorkshopVM
    {
        public int UserId { get; set; }
        public int WorkshopId { get; set; }
        public byte AttendanceType { get; set; }
        public bool IsHost { get; set; }

    }
}
