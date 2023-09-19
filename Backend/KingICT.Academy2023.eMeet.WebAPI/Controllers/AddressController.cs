using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.Addresses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KingICT.Academy2023.eMeet.WebAPI.Controllers
{
	//[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class AddressController : ControllerBase
	{
		private readonly IAddressService _addressService;

		public AddressController(IAddressService addressService)
		{
			_addressService = addressService;
		}


		[AllowAnonymous]
		[HttpGet]
		[ProducesResponseType(typeof(List<AddressDTO>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status500InternalServerError)]
		public async Task<ActionResult<List<AddressDTO>>> GetAll()
		{

				var addresses = await _addressService.GetAll();
				if (addresses == null || !addresses.Any())
				{
					return NotFound("No addresses found.");
				}

				return Ok(addresses);
			

		}
	}
}
