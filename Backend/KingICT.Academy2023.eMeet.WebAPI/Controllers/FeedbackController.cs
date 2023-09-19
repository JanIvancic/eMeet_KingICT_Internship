using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.Addresses;
using KingICT.Academy2023.eMeet.Messaging.Feedbacks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KingICT.Academy2023.eMeet.WebAPI.Controllers
{
	//[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class FeedbackController : ControllerBase
	{
		private readonly IFeedbackService _feedbackService;
        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

		[HttpGet]
		public async Task<ActionResult<List<FeedbackDTO>>> GetAll()
		{

			var feedbacks = await _feedbackService.GetAll();
			if (feedbacks == null || !feedbacks.Any())
			{
				return NotFound("No feedbacks found.");
			}

			return Ok(feedbacks);

		}

		[HttpGet]
		[Route("GetAllByWorkshopId")]
		public async Task<ActionResult<List<FeedbackDTO>>> GetAllByWorkshopId(int workshopId)
		{

			var feedbacks = await _feedbackService.GetAllByWorkshopId(workshopId);
			if (feedbacks == null || !feedbacks.Any())
			{
				return NotFound("No feedbacks found.");
			}

			return Ok(feedbacks);

		}

		[HttpPost]
		public async Task<ActionResult<string>> Insert(CreateFeedbackVM feedbackToCreate)
		{
			try
			{
				await _feedbackService.Insert(feedbackToCreate);
				return Ok("Successfully created the feedback");
			}
			catch (ArgumentNullException)
			{
				return BadRequest("Feedback data is null");
			}
			catch (InvalidOperationException ex)
			{
				return NotFound(ex.Message);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"An error occurred: {ex.Message}");
			}
		}

	}
}
