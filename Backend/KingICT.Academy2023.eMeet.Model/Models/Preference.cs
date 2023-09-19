namespace KingICT.Academy2023.eMeet.Models.Models;

public class Preference
{
    public int IdPreference { get; set; }

    public string Name { get; set; }

    public virtual ICollection<WorkshopPreference> WorkshopPreferences { get; set; }
}
