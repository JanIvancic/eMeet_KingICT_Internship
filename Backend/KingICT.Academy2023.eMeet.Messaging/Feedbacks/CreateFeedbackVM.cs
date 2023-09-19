using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Messaging.Feedbacks
{
	public class CreateFeedbackVM
	{
		public string Comment { get; set; }
		public int Rating { get; set; }
		public int WorkshopId { get; set; }
		public int UserId { get; set; }

	}
}
