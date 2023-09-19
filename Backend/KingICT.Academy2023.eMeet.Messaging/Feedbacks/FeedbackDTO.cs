using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Messaging.Feedbacks
{
	public class FeedbackDTO
	{
		public int Id { get; set; }
		public string Comment { get; set; }
		public int Rating { get; set; }
		public string UserFullName{ get; set; }
	}
}
