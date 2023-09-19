using KingICT.Academy2023.eMeet.Messaging.Rooms;


namespace KingICT.Academy2023.eMeet.Contract
{
	public interface IRoomService
	{
		Task<List<RoomDTO>> GetRoomsByAddressId(int id);
	}
}
