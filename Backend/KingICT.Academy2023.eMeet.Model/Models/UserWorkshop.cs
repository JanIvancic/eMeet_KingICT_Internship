namespace KingICT.Academy2023.eMeet.Models.Models;

public class UserWorkshop
{
    public int UserId { get; set; }

    public int WorkshopId { get; set; }

    public byte AttendanceType { get; set; }

    public bool IsHost { get; set; }

    public virtual User User { get; set; }

    public virtual Workshop Workshop { get; set; }
}
