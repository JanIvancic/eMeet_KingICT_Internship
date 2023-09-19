using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Infrastructure.Cryptography;
using KingICT.Academy2023.eMeet.Infrastructure.MailUtility;
using KingICT.Academy2023.eMeet.Model.Configuration;
using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Repository;
using KingICT.Academy2023.eMeet.Repository.Repositories;
using KingICT.Academy2023.eMeet.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace KingICT.Academy2023.eMeet.IOC
{
	public static class ServiceConfiguration
	{
		public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
		{
			services.AddDbContext<EMeetContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
			services.Configure<WebAppSettings>(configuration.GetSection(nameof(WebAppSettings)));
			services.AddSingleton<MailUtility>(sp => new MailUtility(configuration["MailConfiguration:ApiKey"]));

			services.AddSingleton<Passwordhasher>();

			services.AddTransient<IUserService, UserService>();
			services.AddTransient<IUserRepository, UserRepository>();

			services.AddTransient<IWorkshopService, WorkshopService>();
			services.AddTransient<IWorkshopRepository, WorkshopRepository>();

			services.AddTransient<IPreferenceRepository, PreferenceRepository>();
			services.AddTransient<IPreferenceService, PreferenceService>();

			services.AddTransient<IUserPreferenceRepository, UserPreferenceRepository>();
			//services.AddTransient<IUserPreferenceService, UserPreferenceService>();

			services.AddTransient<IUserWorkshopRepository, UserWorkshopRepository>();
			//services.AddTransient<IUserWorkshopService, UserWorkshopService>();

			services.AddTransient<IAddressRepository, AddressRepository>();
			services.AddTransient<IAddressService, AddressService>();

			services.AddTransient<IRoomRepository, RoomRepository>();
			services.AddTransient<IRoomService, RoomService>();

			services.AddTransient<IPictureRepository, PictureRepository>();
			services.AddTransient<IPictureService, PictureService>();

            services.AddTransient<IUserWorkshopService, UserWorkshopService>();
            services.AddTransient<IUserWorkshopRepository, UserWorkshopRepository>();

            services.AddTransient<IFeedbackService, FeedbackService>();
            services.AddTransient<IFeedbackRepository, FeedbackRepository>();

			services.AddTransient<IWorkshopPreferenceRepository, WorkshopPreferenceRepository>();
			//services.AddTransient<IWorkshopPreferenceService, WorkshopPreferenceService>();


		}
    }

}
