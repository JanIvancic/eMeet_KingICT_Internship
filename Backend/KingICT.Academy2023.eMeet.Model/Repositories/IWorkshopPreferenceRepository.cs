﻿using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Model.Repositories
{
	public interface IWorkshopPreferenceRepository : IRepositoryBase<WorkshopPreference>
	{
		Task<bool> DeleteByWorkshopId(int workshopId);
	}
}
