using KingICT.Academy2023.eMeet.Messaging.Addresses;
using KingICT.Academy2023.eMeet.Messaging.Feedbacks;
using KingICT.Academy2023.eMeet.Messaging.Pictures;
using KingICT.Academy2023.eMeet.Messaging.Preferences;
using KingICT.Academy2023.eMeet.Messaging.Rooms;
using KingICT.Academy2023.eMeet.Messaging.Users;
using KingICT.Academy2023.eMeet.Messaging.UserWorkshops;

namespace KingICT.Academy2023.eMeet.Messaging.Workshops
{
    public class WorkshopDTO
	{
		public int Id { get; set; }

		public string Name { get; set; }

		public DateTime StartDateTime { get; set; }

		public DateTime EndDateTime { get; set; }

		public string Description { get; set; }

		public byte EventType { get; set; }

		public int MaxAttendeesOffline { get; set; }

		public int MaxAttendeesOnline { get; set; }

		public bool IsCancelled { get; set; }

		public bool Availability { get; set; }

		public string AccessLink { get; set; }

		public PictureDTO Picture { get; set; }
		public List<PreferenceDTO> Preferences { get; set; }
		public List<UserWorkshopDTO> Attendees { get; set; }
		public List<UserWorkshopDTO> Hosts { get; set; }
		public List<FeedbackDTO> Feedbacks { get; set; }
		public AddressDTO Address { get; set; }
		public RoomDTO Room { get; set; }


	}
}
