using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Model.Repositories
{
	public interface IFeedbackRepository : IRepositoryBase<Feedback>
	{
		Task<List<Feedback>> GetAllByWorkshopId(int workshopId);
	}
}
