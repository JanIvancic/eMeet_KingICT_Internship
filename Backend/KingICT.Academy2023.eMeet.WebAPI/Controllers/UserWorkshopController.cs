using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.UserWorkshops;
using KingICT.Academy2023.eMeet.Service;
using Microsoft.AspNetCore.Mvc;

namespace KingICT.Academy2023.eMeet.WebAPI.Controllers
{
    [ApiController]
    [Route("api/UserWorkshops")]
    public class UserWorkshopController : ControllerBase
    {
        private readonly IUserWorkshopService _userWorkshopService;
      
        public UserWorkshopController(IUserWorkshopService userWorkshopService)
        {
            _userWorkshopService = userWorkshopService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserWorkshopVM userWorkshopVM)
        {
            await _userWorkshopService.AddUserWorkshopAsync(userWorkshopVM);
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] UserWorkshopVM userWorkshopVM)
        {
            await _userWorkshopService.DeleteUserWorkshopAsync(userWorkshopVM.UserId, userWorkshopVM.WorkshopId);
            return Ok();
        }


    }
}
