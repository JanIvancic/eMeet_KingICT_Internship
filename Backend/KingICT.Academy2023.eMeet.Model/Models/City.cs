namespace KingICT.Academy2023.eMeet.Models.Models;

public class City
{
    public int IdCity { get; set; }

    public string Name { get; set; }

    public int CountryId { get; set; }

    public virtual Country Country { get; set; }

	public ICollection<Room> Rooms { get; set; }

	public virtual ICollection<Address> Addresses { get; set; }
}
