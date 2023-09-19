
using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Model.Repositories
{
	public interface IRoomRepository : IRepositoryBase<Room>
	{
		public Task<List<Room>> GetRoomsByAddressId(int id);
	}
}
