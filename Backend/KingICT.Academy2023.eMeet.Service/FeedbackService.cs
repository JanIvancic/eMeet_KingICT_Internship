using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.Addresses;
using KingICT.Academy2023.eMeet.Messaging.Feedbacks;
using KingICT.Academy2023.eMeet.Messaging.Users;
using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using KingICT.Academy2023.eMeet.Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Service
{
	public class FeedbackService : IFeedbackService
	{
		private readonly IFeedbackRepository _feedbackRepository;
		private readonly IUserRepository _userRepository;
		private readonly IWorkshopRepository _workshopRepository;

		public FeedbackService(IFeedbackRepository feedbackRepository, IUserRepository userRepository, IWorkshopRepository workshopRepository)
		{
			_feedbackRepository = feedbackRepository;
			_userRepository = userRepository;
			_workshopRepository = workshopRepository;
		}

		public async Task<List<FeedbackDTO>> GetAll()
		{
			var feedbackRepo = await _feedbackRepository.GetAll();

			var FeedbackDTOs = new List<FeedbackDTO>();

			foreach (var f in feedbackRepo)
			{
				var user = await _userRepository.GetById(f.UserId);
				var fullName = $"{user.FirstName} {user.LastName}";

				FeedbackDTOs.Add(new FeedbackDTO
				{
					Id = f.IdFeedback,
					UserFullName = fullName,
					Comment = f.Comment,
					Rating = f.Rating
				});
			}

			return FeedbackDTOs;
		}


		public async Task<List<FeedbackDTO>> GetAllByWorkshopId(int workshopId)
		{
			var feedbackRepo = await _feedbackRepository.GetAllByWorkshopId(workshopId);

			var FeedbackDTOs = new List<FeedbackDTO>();

			foreach (var f in feedbackRepo)
			{
				var user = await _userRepository.GetById(f.UserId);
				var fullName = $"{user.FirstName} {user.LastName}";

				FeedbackDTOs.Add(new FeedbackDTO
				{
					Id = f.IdFeedback,
					UserFullName = fullName,
					Comment = f.Comment,
					Rating = f.Rating
				});
			}

			return FeedbackDTOs;
		}

		public async Task Insert(CreateFeedbackVM entity)
		{
			if (entity == null)
				throw new ArgumentNullException(nameof(entity));

			var userExists = await _userRepository.GetById(entity.UserId);
			if (userExists==null)
				throw new InvalidOperationException("User does not exist.");

			var workshopExists = await _workshopRepository.GetById(entity.WorkshopId);
			if (workshopExists==null)
				throw new InvalidOperationException("Workshop does not exist.");

			var feedback = new Feedback
			{
				WorkshopId = entity.WorkshopId,
				UserId = entity.UserId,
				Comment = entity.Comment,
				Rating = entity.Rating,
			};

			await _feedbackRepository.Insert(feedback);
		}

	}
}
