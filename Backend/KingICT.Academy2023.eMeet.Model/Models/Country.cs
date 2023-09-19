namespace KingICT.Academy2023.eMeet.Models.Models;

public class Country
{
    public int IdCountry { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<City> Cities { get; set; }
}
