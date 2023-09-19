using System.Threading.Tasks;
using KingICT.Academy2023.eMeet.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace KingICT.Academy2023.eMeet.Model.Repositories
{
	public interface IUserWorkshopRepository : IRepositoryBase<UserWorkshop>
	{
		Task<int> GetOfflineSignedupUsersSum(int workshopId);
		Task<int> GetOnlinelineSignedupUsersSum(int workshopId);

        Task DeleteUserWorkshop(UserWorkshop entityToDelete, bool saveChanges = true);
    }
}
