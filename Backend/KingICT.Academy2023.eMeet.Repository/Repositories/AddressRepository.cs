using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
    public class AddressRepository : RepositoryBase<Address>, IAddressRepository
	{
		public AddressRepository(EMeetContext dbContext)
			: base(dbContext) { }


		public async Task<List<Address>> GetAllWithDetails()
		{
			return await DbSet
				.Include(x => x.City)
					.ThenInclude(x => x.Country)
				.ToListAsync();
		}

	}
}
