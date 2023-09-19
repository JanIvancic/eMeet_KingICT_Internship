using KingICT.Academy2023.eMeet.Messaging.Addresses;


namespace KingICT.Academy2023.eMeet.Contract
{
	public interface IAddressService
	{
		Task<List<AddressDTO>> GetAll();
		Task<AddressDTO> GetById(object id);
	}
}
