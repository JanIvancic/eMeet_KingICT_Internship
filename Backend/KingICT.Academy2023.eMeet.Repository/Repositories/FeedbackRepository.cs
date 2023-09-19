using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
    public class FeedbackRepository : RepositoryBase<Feedback>, IFeedbackRepository
	{
		public FeedbackRepository(EMeetContext dbContext)
            : base(dbContext) { }

		public async Task<List<Feedback>> GetAllByWorkshopId(int workshopId)
		{
			return await DbSet.Where(f => f.WorkshopId == workshopId).ToListAsync();
		}
	}
}
