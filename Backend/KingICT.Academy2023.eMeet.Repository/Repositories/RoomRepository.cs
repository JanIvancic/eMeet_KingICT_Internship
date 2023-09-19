using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
	public class RoomRepository : RepositoryBase<Room>, IRoomRepository
	{
		public RoomRepository(EMeetContext dbContext)
			: base(dbContext) { }


		public async Task<List<Room>> GetRoomsByAddressId(int id)
		{
			return await DbSet
				.Where(room => room.City.Addresses.Any(address => address.CityId == id))
				.ToListAsync();
		}

	}
}
