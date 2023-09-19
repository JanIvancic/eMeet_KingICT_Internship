using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using KingICT.Academy2023.eMeet.Service;
using KingICT.Academy2023.eMeet.Messaging.Preferences;
using System.Threading.Tasks;
using System.Collections.Generic;
using KingICT.Academy2023.eMeet.Contract;
using Microsoft.AspNetCore.Authorization;

namespace KingICT.Academy2023.eMeet.WebAPI.Controllers
{
	//[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class PreferenceController : ControllerBase
	{
		private readonly IPreferenceService _preferenceService;

		public PreferenceController(IPreferenceService preferenceService)
		{
			_preferenceService = preferenceService;
		}







		[AllowAnonymous]
		[HttpGet]
		[ProducesResponseType(typeof(List<PreferenceDTO>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<List<PreferenceDTO>>> GetAll()
		{
			try
			{
				var preferences = await _preferenceService.GetAll();
				if (preferences == null || !preferences.Any())
				{
					return NotFound("No preferences found.");
				}

				return Ok(preferences);
			}
			catch (Exception)
			{
				return StatusCode(500, "An unexpected error occurred.");
			}
		}

		[HttpGet("{id}")]
		[ProducesResponseType(typeof(PreferenceDTO), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<PreferenceDTO>> GetById(int id)
		{
			try
			{
				var preference = await _preferenceService.GetById(id);
				if (preference == null)
				{
					return NotFound($"Preference with ID {id} not found.");
				}

				return Ok(preference);
			}
			catch (Exception)
			{
				return StatusCode(500, "An unexpected error occurred.");
			}
		}

	}
}
