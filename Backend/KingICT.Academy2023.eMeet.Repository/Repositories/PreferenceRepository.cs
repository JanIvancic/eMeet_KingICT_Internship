using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
    public class PreferenceRepository : RepositoryBase<Preference>, IPreferenceRepository
	{
		public PreferenceRepository(EMeetContext dbContext)
            : base(dbContext) { }
    }
}
