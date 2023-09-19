using KingICT.Academy2023.eMeet.Messaging.Workshops;

namespace KingICT.Academy2023.eMeet.Contract
{
    public interface IWorkshopService
	{
		Task<WorkshopDTO> GetDetailsById(int id);

		Task<int> CreateWorkshop(CreateWorkshopVM workshop);

		Task<List<int>> GetAllIdsByPreferenceId(int preferenceId);

		Task<List<WorkshopStatistics>> GetAllWorkshopsStatistics();

		Task<int> UpdateWorkshop(CreateWorkshopVM workshop);

		Task<bool> DeleteWorkshop(int workshopId);
	}
}
