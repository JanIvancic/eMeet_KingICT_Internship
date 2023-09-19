namespace KingICT.Academy2023.eMeet.Models.Models;

public class Room
{
	public int IdRoom { get; set; }

	public string Name { get; set; }

	public int CityId { get; set; }

	public virtual City City { get; set; }
	public virtual ICollection<Workshop> Workshops { get; set; }


	public Room()
	{
		Workshops = new HashSet<Workshop>();
	}
}

