using KingICT.Academy2023.eMeet.Messaging.Addresses;
using KingICT.Academy2023.eMeet.Messaging.Feedbacks;
using KingICT.Academy2023.eMeet.Messaging.Pictures;
using KingICT.Academy2023.eMeet.Messaging.Preferences;
using KingICT.Academy2023.eMeet.Messaging.Rooms;
using KingICT.Academy2023.eMeet.Messaging.Users;
using KingICT.Academy2023.eMeet.Messaging.UserWorkshops;

namespace KingICT.Academy2023.eMeet.Messaging.Workshops
{
	public class CreateWorkshopVM
	{
        public int Id { get; set; }
        public List<int> PreferenceIds { get; set; }

		public string Name { get; set; }
		
		public string Description { get; set; }
		
		public bool Availability { get; set; }
		
		public byte EventType { get; set; }

		public int MaxAttendeesOffline { get; set; }

		public int MaxAttendeesOnline { get; set; }

		public int PictureId { get; set; }

		public DateTime StartDateTime { get; set; }

		public DateTime EndDateTime { get; set; }
		
		public int AddressId { get; set; }
		
		public int RoomId { get; set; }

		public List<int> HostIds { get; set; }

		public string AccessLink { get; set; }

	}
}
