using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.Pictures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KingICT.Academy2023.eMeet.WebAPI.Controllers
{
	//[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class PictureController : ControllerBase
	{
		private readonly IPictureService _pictureService;

		public PictureController(IPictureService pictureService)
		{
			_pictureService = pictureService;
		}


		[AllowAnonymous]
		[HttpGet]
		[ProducesResponseType(typeof(List<PictureDTO>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<List<PictureDTO>>> GetAll()
		{

			var pictures = await _pictureService.GetAll();
			if (pictures == null || !pictures.Any())
			{
				return NotFound("No pictures found.");
			}

			return Ok(pictures);


		}
	}
}
