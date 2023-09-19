using KingICT.Academy2023.eMeet.Model.Repositories;
using Microsoft.EntityFrameworkCore;
using KingICT.Academy2023.eMeet.Models.Models;
using KingICT.Academy2023.eMeet.Messaging.Users;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
	public class UserRepository : RepositoryBase<User>, IUserRepository
	{
		public UserRepository(EMeetContext dbContext)
			: base(dbContext) { }

		public async Task<List<User>> GetAllInstructors()
		{
			return await DbSet
				.Where(u => u.Role == 2) // 2-Admin
				.ToListAsync();
		}

		public async Task<List<User>> GetAllUsers()
		{
			return await DbSet
				.Where(u => u.Role == 3) // 2-Admin
				.ToListAsync();
		}

		public async Task<User> GetUserByEmail(string email)
		{
			return await DbSet.FirstOrDefaultAsync(u => u.Email == email);
		}

		public async Task<User> GetUserByRegistrationToken(string token)
		{
			return await DbSet.FirstOrDefaultAsync(u => u.RegisterToken == token);
		}

		public async Task<User> GetUserByResetPasswordToken(string token)
		{
			return await DbSet.FirstOrDefaultAsync(u => u.ResetPasswordToken == token);
		}

		public async Task<User> GetUserProfileDetailsById(int id)
		{
			return await DbSet.FirstOrDefaultAsync(u => u.IdUser == id);
		}
	}
}
