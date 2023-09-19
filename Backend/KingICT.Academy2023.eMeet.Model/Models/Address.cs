namespace KingICT.Academy2023.eMeet.Models.Models;

public class Address
{
    public int IdAddress { get; set; }

    public string StreetName { get; set; }

    public string HouseNumber { get; set; }

    public string ZipCode { get; set; }

    public int CityId { get; set; }

    public virtual City City { get; set; }
	public virtual ICollection<Workshop> Workshops { get; set; }


	public Address()
	{
		Workshops = new HashSet<Workshop>();
	}
}
