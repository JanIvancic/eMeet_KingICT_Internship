using KingICT.Academy2023.eMeet.Messaging.Pictures;


namespace KingICT.Academy2023.eMeet.Contract
{
	public interface IPictureService
	{
		Task<List<PictureDTO>> GetAll();
		Task<PictureDTO> GetById(object id);
	}
}
