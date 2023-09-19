namespace KingICT.Academy2023.eMeet.Models.Models;

public class Workshop
{
	public int IdWorkshop { get; set; }

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

	public int RoomId { get; set; }
	public int PictureId { get; set; }
	public int AddressId { get; set; }

	public virtual Room Room { get; set; }
	public virtual Picture Picture { get; set; }
	public virtual Address Address { get; set; }

	public virtual ICollection<Feedback> Feedbacks { get; set; }

	public virtual ICollection<WorkshopPreference> WorkshopPreferences { get; set; }

	public virtual ICollection<UserWorkshop> UserWorkshops { get; set; }
}
