using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
    public class PictureRepository : RepositoryBase<Picture>, IPictureRepository
	{
		public PictureRepository(EMeetContext dbContext)
            : base(dbContext) { }
    }
}
