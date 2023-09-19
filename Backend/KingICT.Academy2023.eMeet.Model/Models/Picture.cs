namespace KingICT.Academy2023.eMeet.Models.Models;

public class Picture
{
    public int IdPicture { get; set; }

    public string Url { get; set; }

    public int Preference { get; set; }

    public virtual ICollection<Workshop> Workshops { get; set; }


	public Picture()
	{
		Workshops = new HashSet<Workshop>();
	}
}
