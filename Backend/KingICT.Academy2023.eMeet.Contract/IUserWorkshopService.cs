using KingICT.Academy2023.eMeet.Messaging.UserWorkshops;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Contract
{
    public interface IUserWorkshopService
    {
        Task AddUserWorkshopAsync(UserWorkshopVM userWorkshop);
        Task DeleteUserWorkshopAsync(int userId, int workshopId); 

    }
}
