using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Model.Repositories
{
	public interface IUserPreferenceRepository : IRepositoryBase<UserPreference>
	{
		Task<List<UserPreference>> GetByUserId(int userId);
		Task<bool> DeleteByUserId(int userId);
	}
}
