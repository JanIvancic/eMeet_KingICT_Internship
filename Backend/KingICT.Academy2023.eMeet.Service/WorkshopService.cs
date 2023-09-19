using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.Addresses;
using KingICT.Academy2023.eMeet.Messaging.Feedbacks;
using KingICT.Academy2023.eMeet.Messaging.Pictures;
using KingICT.Academy2023.eMeet.Messaging.Preferences;
using KingICT.Academy2023.eMeet.Messaging.Rooms;
using KingICT.Academy2023.eMeet.Messaging.Users;
using KingICT.Academy2023.eMeet.Messaging.UserWorkshops;
using KingICT.Academy2023.eMeet.Messaging.Workshops;
using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using KingICT.Academy2023.eMeet.Repository.Repositories;
using Microsoft.AspNet.Identity;

namespace KingICT.Academy2023.eMeet.Service
{
	public class WorkshopService : IWorkshopService
	{
		private readonly IWorkshopRepository _workshopRepository;
		private readonly IUserWorkshopRepository _userWorkshopRepository;
		private readonly IWorkshopPreferenceRepository _workshopPreferenceRepository;

		public WorkshopService(IWorkshopRepository workshopRepository, IUserWorkshopRepository userWorkshopRepository, IWorkshopPreferenceRepository workshopPreferenceRepository)
		{
			_workshopRepository = workshopRepository;
			_userWorkshopRepository = userWorkshopRepository;
			_workshopPreferenceRepository = workshopPreferenceRepository;
		}

		public async Task<List<WorkshopStatistics>> GetAllWorkshopsStatistics()
		{
			var workshops = await _workshopRepository.GetAllNotDeleted();
			List<WorkshopStatistics> statisticsList = new List<WorkshopStatistics>();

			foreach (var workshop in workshops)
			{
				var offlineSingedUp = await _userWorkshopRepository.GetOfflineSignedupUsersSum(workshop.IdWorkshop);
				var onlineSingedUp = await _userWorkshopRepository.GetOnlinelineSignedupUsersSum(workshop.IdWorkshop);

				WorkshopStatistics statistics = new WorkshopStatistics
				{
					Id = workshop.IdWorkshop,
					Title = workshop.Name,
					OfflineAttendees = workshop.MaxAttendeesOffline,
					OfflineSignedUpAttendees = offlineSingedUp,
					OnlineSignedUpAttendees = onlineSingedUp,
					OnlineAttendees = workshop.MaxAttendeesOnline,
					CertificatesGiven = offlineSingedUp+onlineSingedUp,
				};

				statisticsList.Add(statistics);
			}

			return statisticsList;
		}

		public async Task<int> CreateWorkshop(CreateWorkshopVM workshop)
		{
			Workshop repoWorkshop = new Workshop
			{
				Name = workshop.Name,
				StartDateTime = workshop.StartDateTime,
				EndDateTime = workshop.EndDateTime,
				Description = workshop.Description,
				EventType = workshop.EventType,
				MaxAttendeesOffline = workshop.MaxAttendeesOffline,
				MaxAttendeesOnline = workshop.MaxAttendeesOnline,
				IsCancelled = false,
				Availability = workshop.Availability,
				AccessLink = workshop.AccessLink,
				RoomId = workshop.RoomId,
				Feedbacks = null,
				AddressId = workshop.AddressId,
				PictureId = workshop.PictureId,
				WorkshopPreferences = workshop.PreferenceIds.Select(p => new WorkshopPreference
				{
					PreferenceId = p
				}).ToList(),
				//Populate only hosts, leave attendees to apply to the workshop manually
				UserWorkshops = workshop.HostIds.Select(u => new UserWorkshop
				{
					UserId = u,
					AttendanceType = 3, //admin can't select AttendanceType!?
					IsHost = true,
				}).ToList()
			};

			var createdWorkshop = await _workshopRepository.Insert(repoWorkshop);

			foreach (var wp in createdWorkshop.WorkshopPreferences)
			{
				wp.WorkshopId = createdWorkshop.IdWorkshop;
			}

			foreach (var uw in createdWorkshop.UserWorkshops)
			{
				uw.WorkshopId = createdWorkshop.IdWorkshop;
			}

			await _workshopRepository.SaveChanges();

			return createdWorkshop.IdWorkshop;
		}


		public async Task<int> UpdateWorkshop(CreateWorkshopVM workshop)
		{
			var existingWorkshop = await _workshopRepository.GetDetailsById(workshop.Id);

			if (existingWorkshop == null)
			{
				return 0;
			}

			existingWorkshop.Name = workshop.Name;
			existingWorkshop.StartDateTime = workshop.StartDateTime;
			existingWorkshop.EndDateTime = workshop.EndDateTime;
			existingWorkshop.Description = workshop.Description;
			existingWorkshop.EventType = workshop.EventType;
			existingWorkshop.MaxAttendeesOffline = workshop.MaxAttendeesOffline;
			existingWorkshop.MaxAttendeesOnline = workshop.MaxAttendeesOnline;
			existingWorkshop.Availability = workshop.Availability;
			existingWorkshop.AccessLink = workshop.AccessLink;
			existingWorkshop.RoomId = workshop.RoomId;
			existingWorkshop.AddressId = workshop.AddressId;
			existingWorkshop.PictureId = workshop.PictureId;


			await _workshopPreferenceRepository.DeleteByWorkshopId(workshop.Id);

			var updatedWorkshopPreferences = workshop.PreferenceIds.Select(prefId => new WorkshopPreference
			{
				WorkshopId = workshop.Id,
				PreferenceId = prefId
			}).ToList();

			foreach (var workshopPreference in updatedWorkshopPreferences)
			{
				await _workshopPreferenceRepository.Insert(workshopPreference);
			}

			var preferenceIds = updatedWorkshopPreferences.Select(up => up.PreferenceId).ToList();

			//ADD DELETE PREDAVACA I INSERT NOVE

			
			await _workshopPreferenceRepository.SaveChanges();

			await _workshopRepository.Update(existingWorkshop);
			await _workshopRepository.SaveChanges();

			return existingWorkshop.IdWorkshop;
		}



		public async Task<WorkshopDTO> GetDetailsById(int id)
		{
			var workshop = await _workshopRepository.GetDetailsById(id);

			if (workshop == null)
				return null;

			var worksopDto = new WorkshopDTO
			{
				Id = workshop.IdWorkshop,
				Name = workshop.Name,
				StartDateTime = workshop.StartDateTime,
				EndDateTime = workshop.EndDateTime,
				Description = workshop.Description,
				EventType = workshop.EventType,
				MaxAttendeesOffline = workshop.MaxAttendeesOffline,
				MaxAttendeesOnline = workshop.MaxAttendeesOnline,
				IsCancelled = workshop.IsCancelled,
				Availability = workshop.Availability,
				AccessLink = workshop.AccessLink,
				Room = new RoomDTO
				{
					Id = workshop.Room.IdRoom,
					Name = workshop.Room.Name
				},
				Preferences = workshop.WorkshopPreferences.Select(x => new PreferenceDTO
				{
					Id = x.PreferenceId,
					Name = x.Preference.Name
				}).ToList(),
				Attendees = workshop.UserWorkshops
				.Where(x => !x.IsHost)
				.Select(x => new UserWorkshopDTO
				{
					Id = x.UserId,
					AttendanceType = x.AttendanceType,
					IsHost = x.IsHost,
					FirstName = x.User.FirstName,
					LastName = x.User.LastName,
					Email = x.User.Email,
					PhoneNumber = x.User.PhoneNumber,
					Role = x.User.Role,
					Deleted = x.User.Deleted
				}).ToList(),
				Hosts = workshop.UserWorkshops
				.Where(x => x.IsHost)
				.Select(x => new UserWorkshopDTO
				{
					Id = x.UserId,
					AttendanceType = x.AttendanceType,
					IsHost = x.IsHost,
					FirstName = x.User.FirstName,
					LastName = x.User.LastName,
					Email = x.User.Email,
					PhoneNumber = x.User.PhoneNumber,
					Role = x.User.Role,
					Deleted = x.User.Deleted
				}).ToList(),
				Picture = new PictureDTO
				{
					Id = workshop.Picture.IdPicture,
					Url = workshop.Picture.Url,
					Preference = workshop.Picture.Preference,
				},
				Feedbacks = workshop.Feedbacks.Select(x => new FeedbackDTO
				{
					Id = x.IdFeedback,
					Comment = x.Comment,
					Rating = x.Rating,
					UserFullName = x.User.FirstName + " " + x.User.LastName,
				}).ToList(),
				Address = new AddressDTO
				{
					Id = workshop.Address.IdAddress,
					HouseNumber = workshop.Address.HouseNumber,
					ZipCode = workshop.Address.ZipCode,
					StreetName = workshop.Address.StreetName,
					CityName = workshop.Address.City.Name,
					CountryName = workshop.Address.City.Country.Name,
				},
			};

			return worksopDto;
		}
		public async Task<List<int>> GetAllIdsByPreferenceId(int preferenceId)
		{
			return await _workshopRepository.GetAllIdsByPreferenceId(preferenceId);
		}

		public async Task<bool> DeleteWorkshop(int workshopId)
		{
			return await _workshopRepository.SoftDelete(workshopId);
		}
	}
}
