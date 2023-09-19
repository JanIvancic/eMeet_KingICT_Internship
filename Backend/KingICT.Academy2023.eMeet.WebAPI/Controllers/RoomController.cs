using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KingICT.Academy2023.eMeet.WebAPI.Controllers
{
	//[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class RoomController : ControllerBase
	{
		private readonly IRoomService _roomService;

		public RoomController(IRoomService roomService)
		{
			_roomService = roomService;
		}

		[HttpGet]
		[Route("GetRoomsByAddressId")]
		public async Task<IActionResult> GetRoomsByAddressId(int id)
		{
			try
			{
				var room = await _roomService.GetRoomsByAddressId(id);
				if (room == null)
					return NotFound("Address or rooms for that address don't exist");

				return Ok(room);
			}
			catch (KeyNotFoundException) { return NotFound(); }
			catch (Exception) { return StatusCode(500, "An unexpected error occurred."); }
		}
	}
}
