using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Messaging.Workshops
{
	public class WorkshopStatistics
	{
        public int Id { get; set; }
        public string Title { get; set; }
        public int OnlineAttendees { get; set; }
        public int OnlineSignedUpAttendees { get; set; }
        public int OfflineAttendees { get; set; }
		public int OfflineSignedUpAttendees { get; set; }
		public int CertificatesGiven { get; set; }
	}
}
