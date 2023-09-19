using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
	public  class UserWorkshopRepository : RepositoryBase<UserWorkshop>, IUserWorkshopRepository
	{
		public UserWorkshopRepository(EMeetContext dbContext)
			: base(dbContext) { }

		public async Task<int> GetOfflineSignedupUsersSum(int workshopId)
		{
			return await DbSet.Where(up => up.WorkshopId == workshopId && up.IsHost == false && up.AttendanceType == 2).CountAsync();
		}
		public async Task<int> GetOnlinelineSignedupUsersSum(int workshopId)
		{
			return await DbSet.Where(up => up.WorkshopId == workshopId && up.IsHost == false && up.AttendanceType == 1).CountAsync();
		}



		
        public async Task DeleteUserWorkshop(UserWorkshop entityToDelete, bool saveChanges = true)
        {
            if (entityToDelete != null)
            {
                DbSet.Remove(entityToDelete);

                if (saveChanges)
                    await SaveChanges();
            }
        }

    }
}
