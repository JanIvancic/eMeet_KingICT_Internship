using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
	public class WorkshopPreferenceRepository : RepositoryBase<WorkshopPreference>, IWorkshopPreferenceRepository
	{
		public WorkshopPreferenceRepository(EMeetContext dbContext)
			: base(dbContext) { }

		public async Task<bool> DeleteByWorkshopId(int workshopId)
		{
			var workshopPreferences = await DbSet.Where(up => up.WorkshopId == workshopId).ToListAsync();

			if (workshopPreferences.Count == 0)
			{
				return false;
			}

			DbSet.RemoveRange(workshopPreferences);
			await DbContext.SaveChangesAsync();
			return true;
		}
	}
}
