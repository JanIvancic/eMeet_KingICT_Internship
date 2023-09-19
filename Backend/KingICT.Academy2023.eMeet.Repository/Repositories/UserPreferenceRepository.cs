using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
	public class UserPreferenceRepository : RepositoryBase<UserPreference>, IUserPreferenceRepository
	{
		public UserPreferenceRepository(EMeetContext dbContext)
			: base(dbContext) { }

		public async Task<bool> DeleteByUserId(int userId)
		{
			var userPreferences = await DbSet.Where(up => up.UserId == userId).ToListAsync();

			if (userPreferences.Count == 0)
			{
				return false;
			}

			DbSet.RemoveRange(userPreferences);
			await DbContext.SaveChangesAsync();
			return true;
		}

		public async Task<List<UserPreference>> GetByUserId(int userId)
		{
			return await DbSet.Where(up => up.UserId == userId).ToListAsync();
		}
	}
}
