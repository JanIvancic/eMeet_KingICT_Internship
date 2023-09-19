namespace KingICT.Academy2023.eMeet.Models.Models;

public class UserPreference
{
	public UserPreference() { }

	public UserPreference(int userId, int preferenceId)
	{
		UserId = userId;
		PreferenceId = preferenceId;
	}

	public int UserId { get; set; }

    public int PreferenceId { get; set; }

    public virtual Preference Preference { get; set; }

    public virtual User User { get; set; }
}
