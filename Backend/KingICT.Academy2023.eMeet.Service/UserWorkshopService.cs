using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.UserWorkshops;
using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Service
{
    public class UserWorkshopService : IUserWorkshopService
    {
        private readonly IUserWorkshopRepository _userWorkshopRepository;

        public UserWorkshopService(IUserWorkshopRepository userWorkshopRepository)
        {
            _userWorkshopRepository = userWorkshopRepository;
        }

        public async Task AddUserWorkshopAsync(UserWorkshopVM userWorkshop)
        {
            UserWorkshop userWorkshopEntity = new UserWorkshop
            {
                UserId = userWorkshop.UserId,
                WorkshopId = userWorkshop.WorkshopId,
                AttendanceType = userWorkshop.AttendanceType,
                IsHost = userWorkshop.IsHost
            };

            await _userWorkshopRepository.Insert(userWorkshopEntity);
        }

        public async Task DeleteUserWorkshopAsync(int userId, int workshopId)
        {
            var allUserWorkshops = await _userWorkshopRepository.GetAll().ConfigureAwait(false);
            var entity = allUserWorkshops.Where(uw => uw.UserId == userId && uw.WorkshopId == workshopId).FirstOrDefault();

            if (entity != null)
            {
                await _userWorkshopRepository.DeleteUserWorkshop(entity, true);
            }
        }





    }
}
