using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.Addresses;
using KingICT.Academy2023.eMeet.Messaging.Rooms;
using KingICT.Academy2023.eMeet.Model.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Service
{
	public class RoomService : IRoomService
	{
		private readonly IRoomRepository _roomRepository;

		public RoomService(IRoomRepository roomRepository)
		{
			_roomRepository = roomRepository;
		}
		public async Task<List<RoomDTO>> GetRoomsByAddressId(int id)
		{
			var repoRooms = await _roomRepository.GetRoomsByAddressId(id);

			var RoomDTOs = repoRooms.Select(r => new RoomDTO
			{
				Id = r.IdRoom,
				Name = r.Name,
			}).ToList();

			return RoomDTOs;
		}
	}
}
