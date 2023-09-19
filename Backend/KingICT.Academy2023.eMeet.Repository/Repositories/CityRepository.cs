using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
    public class CityRepository : RepositoryBase<City>, ICityRepository
	{
		public CityRepository(EMeetContext dbContext)
			: base(dbContext) { }
	}
}
