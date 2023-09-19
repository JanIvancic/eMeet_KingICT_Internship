using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Model.Repositories
{
	public interface IWorkshopRepository : IRepositoryBase<Workshop>
	{
		Task<Workshop> GetDetailsById(int id);
		Task<List<int>> GetAllIdsByPreferenceId(int preferenceId);
		Task<IEnumerable<Workshop>> GetByUserId(int userId);
		Task<bool> SoftDelete(int workshopId);
		Task<List<Workshop>> GetAllNotDeleted();
	}
}
