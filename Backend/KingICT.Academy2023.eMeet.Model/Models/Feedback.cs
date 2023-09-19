namespace KingICT.Academy2023.eMeet.Models.Models;

public class Feedback
{
    public int IdFeedback { get; set; }

    public string Comment { get; set; }

    public int Rating { get; set; }

    public int WorkshopId { get; set; }

    public int UserId { get; set; }

    public virtual User User { get; set; }

	public virtual Workshop Workshop { get; set; }
}
