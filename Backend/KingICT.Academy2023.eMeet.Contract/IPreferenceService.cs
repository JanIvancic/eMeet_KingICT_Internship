using KingICT.Academy2023.eMeet.Messaging.Preferences;


namespace KingICT.Academy2023.eMeet.Contract
{
	public interface IPreferenceService
	{
		Task<List<PreferenceDTO>> GetAll();
		Task<PreferenceDTO> GetById(object id);
	}
}
