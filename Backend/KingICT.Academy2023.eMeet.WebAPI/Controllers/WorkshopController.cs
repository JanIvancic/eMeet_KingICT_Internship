using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.Workshops;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace KingICT.Academy2023.eMeet.WebAPI.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WorkshopController : ControllerBase
    {
        private readonly IWorkshopService _workshopService;

        public WorkshopController(IWorkshopService workshopService)
        {
            _workshopService = workshopService;
        }

        [HttpGet]
        [Route("Details")]
        public async Task<IActionResult> GetDetails(int id)
        {
            var reponseDto = await _workshopService.GetDetailsById(id);

            if (reponseDto == null)
                return NotFound();

            return Ok(reponseDto);
        }

		[HttpPost]
		[Route("CreateWorkshop")]
		public async Task<IActionResult> CreateWorkshop(CreateWorkshopVM workshop)
		{
			var newWorkshopId = await _workshopService.CreateWorkshop(workshop);

			if (newWorkshopId==0)
				return BadRequest("Failed to create the workshop");

			return Ok(new
			{
				status = "Successfully created the workshop!",
				workshopId = newWorkshopId
			});
		}

		[HttpPut]
		[Route("UpdateWorkshop")]
		public async Task<IActionResult> UpdateWorkshop(CreateWorkshopVM workshop)
		{
			var updatedWorkshopId = await _workshopService.UpdateWorkshop(workshop);

			if (updatedWorkshopId == 0)
				return BadRequest("Failed to update the workshop");

			return Ok(new
			{
				status = "Successfully updated the workshop!",
				workshopId = updatedWorkshopId
			});
		}

		[HttpDelete]
		[Route("DeleteWorkshop")]
		public async Task<IActionResult> DeleteWorkshop(int workshopId)
		{
			var updatedWorkshopId = await _workshopService.DeleteWorkshop(workshopId);

			if (!updatedWorkshopId)
				return BadRequest("Failed to delete the workshop");

			return Ok("Successfully deleted the workshop");
		}


		[HttpGet("GetAllIdsByPreferenceId")]
		public async Task<IActionResult> GetAllIdsByPreferenceId(int preferenceId)
		{
			var workshopIds = await _workshopService.GetAllIdsByPreferenceId(preferenceId);
			return Ok(workshopIds);
		}

		[HttpGet("GetAllWorkshopsStatistics")]
		public async Task<IActionResult> GetAllWorkshopsStatistics()
		{
			var workshops = await _workshopService.GetAllWorkshopsStatistics();
			if(workshops == null)
				return NotFound();
			return Ok(workshops);
		}
	}
}
