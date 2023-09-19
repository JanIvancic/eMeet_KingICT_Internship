namespace KingICT.Academy2023.eMeet.Models.Models;

public class WorkshopPreference
{
    public int WorkshopId { get; set; }

    public int PreferenceId { get; set; }

    public virtual Preference Preference { get; set; }

    public virtual Workshop Workshop { get; set; }
}
