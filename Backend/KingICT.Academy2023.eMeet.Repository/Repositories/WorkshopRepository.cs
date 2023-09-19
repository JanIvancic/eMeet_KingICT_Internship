using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
	public class WorkshopRepository : RepositoryBase<Workshop>, IWorkshopRepository
	{
		public WorkshopRepository(EMeetContext dbContext)
			: base(dbContext) { }

		public async Task<Workshop> GetDetailsById(int id)
		{
			return await DbSet
				.Include(x => x.Room)
				.Include(x => x.Picture)
				.Include(x => x.Feedbacks)
					.ThenInclude(x => x.User)
				.Include(x => x.UserWorkshops)
					.ThenInclude(x => x.User)
				.Include(x => x.WorkshopPreferences)
					.ThenInclude(x => x.Preference)
				.Include(x => x.Address)
					.ThenInclude(x => x.City)
						.ThenInclude(x => x.Country)
				.Where(x => x.IdWorkshop == id && x.IsCancelled==false)
				.FirstOrDefaultAsync();
		}

		public async Task<IEnumerable<Workshop>> GetByUserId(int userId)
		{
			return await DbSet
					   .Include(x => x.UserWorkshops)
							.ThenInclude(x => x.User)
					   .Where(x => x.UserWorkshops.Any(uw => uw.UserId == userId ) && x.IsCancelled == false)
					   .ToListAsync();
		}

		public async Task<List<int>> GetAllIdsByPreferenceId(int preferenceId)
		{
			var workshopIds = await DbSet
				.Where(x => x.WorkshopPreferences.Any(p => p.PreferenceId == preferenceId) && x.IsCancelled == false)
				.Select(x => x.IdWorkshop)
				.ToListAsync();
			return workshopIds;
		}

		public async Task<bool> SoftDelete(int workshopId)
		{
			var workshop = await DbSet.FindAsync(workshopId);
			if (workshop == null)
			{
				throw new ArgumentException("Invalid workshop ID");
			}


			workshop.IsCancelled = true;

			DbSet.Update(workshop);
			await SaveChanges();
			return true;
		}

		public async Task<List<Workshop>> GetAllNotDeleted()
		{
			return await DbSet
				.Where(x => x.IsCancelled == false)
				.ToListAsync();
		}

	}
}
