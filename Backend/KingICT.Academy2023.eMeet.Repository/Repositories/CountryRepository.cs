using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
    public class CountryRepository : RepositoryBase<Country>, ICountryRepository
	{
		public CountryRepository(EMeetContext dbContext)
            : base(dbContext) { }
    }
}
