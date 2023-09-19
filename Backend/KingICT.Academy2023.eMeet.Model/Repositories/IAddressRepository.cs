using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Model.Repositories
{
    public interface IAddressRepository : IRepositoryBase<Address>
	{
		public Task<List<Address>> GetAllWithDetails();
	}
}
