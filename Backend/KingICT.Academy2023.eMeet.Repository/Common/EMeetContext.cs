using KingICT.Academy2023.eMeet.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace KingICT.Academy2023.eMeet.Repository;

public class EMeetContext : DbContext
{
	public EMeetContext() { }

	public EMeetContext(DbContextOptions<EMeetContext> options)
		: base(options) { }

	public virtual DbSet<Address> Addresses { get; set; }
	public virtual DbSet<City> Cities { get; set; }
	public virtual DbSet<Country> Countries { get; set; }
	public virtual DbSet<Feedback> Feedbacks { get; set; }
	public virtual DbSet<Picture> Pictures { get; set; }
	public virtual DbSet<Preference> Preferences { get; set; }
	public virtual DbSet<User> Users { get; set; }
	public virtual DbSet<UserPreference> UserPreferences { get; set; }
	public virtual DbSet<UserWorkshop> UserWorkshops { get; set; }
	public virtual DbSet<Workshop> Workshops { get; set; }
	public virtual DbSet<WorkshopPreference> WorkshopPreferences { get; set; }
	public virtual DbSet<Room> Rooms { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{

		modelBuilder.Entity<WorkshopPreference>(entity =>
		{
			entity.ToTable(nameof(WorkshopPreference));
			entity.HasKey(e => new { e.WorkshopId, e.PreferenceId });

			entity.HasOne(e => e.Workshop)
				.WithMany(w => w.WorkshopPreferences)
				.HasForeignKey(e => e.WorkshopId);

			entity.HasOne(e => e.Preference)
				.WithMany(p => p.WorkshopPreferences)
				.HasForeignKey(e => e.PreferenceId);
		});

		modelBuilder.Entity<UserWorkshop>(entity =>
		{
			entity.ToTable(nameof(UserWorkshop));
			entity.HasKey(e => new { e.UserId, e.WorkshopId });

			entity.HasOne(e => e.User)
				.WithMany(u => u.UserWorkshops)
				.HasForeignKey(e => e.UserId);

			entity.HasOne(e => e.Workshop)
				.WithMany(w => w.UserWorkshops)
				.HasForeignKey(e => e.WorkshopId);
		});

		modelBuilder.Entity<City>(entity =>
		{
			entity.ToTable(nameof(City));
			entity.HasKey(e => e.IdCity);

			entity.HasOne(d => d.Country)
				.WithMany(p => p.Cities)
				.HasForeignKey(d => d.CountryId);

			entity.Property(e => e.Name)
				.HasMaxLength(100)
				.IsRequired();
		});

		modelBuilder.Entity<Address>(entity =>
		{
			entity.ToTable(nameof(Address));
			entity.HasKey(e => e.IdAddress);

			entity.HasOne(d => d.City)
				.WithMany(p => p.Addresses)
				.HasForeignKey(d => d.CityId);

			entity.Property(e => e.StreetName)
				.HasMaxLength(100)
				.IsRequired();
			entity.Property(e => e.HouseNumber)
				.HasMaxLength(10)
				.IsRequired();
			entity.Property(e => e.ZipCode)
				.HasMaxLength(10)
				.IsRequired();
		});

		modelBuilder.Entity<Feedback>(entity =>
		{
			entity.ToTable(nameof(Feedback));
			entity.HasKey(e => e.IdFeedback);

			entity.HasOne(d => d.User)
				.WithMany(p => p.Feedbacks)
				.HasForeignKey(d => d.UserId);

			entity.HasOne(d => d.Workshop)
				.WithMany(p => p.Feedbacks)
				.HasForeignKey(d => d.WorkshopId);

			entity.Property(e => e.Comment)
				.HasMaxLength(300);
		});

		modelBuilder.Entity<Picture>(entity =>
		{
			entity.ToTable(nameof(Picture));
			entity.HasKey(e => e.IdPicture);

			entity.Property(e => e.Url)
				.IsRequired();

			entity.Property(e => e.Preference)
				.IsRequired();
		});

		modelBuilder.Entity<UserPreference>(entity =>
		{
			entity.ToTable(nameof(UserPreference));
			entity.HasKey(e => new { e.PreferenceId, e.UserId });

			entity.HasOne(d => d.Preference)
				.WithMany()
				.HasForeignKey(d => d.PreferenceId);

			entity.HasOne(d => d.User)
				.WithMany()
				.HasForeignKey(d => d.UserId);
		});

		modelBuilder.Entity<Country>(entity =>
		{
			entity.ToTable(nameof(Country));
			entity.HasKey(e => e.IdCountry);

			entity.Property(e => e.Name)
				.HasMaxLength(100)
				.IsRequired();
		});

		modelBuilder.Entity<Preference>(entity =>
		{
			entity.ToTable(nameof(Preference));
			entity.HasKey(e => e.IdPreference);

			entity.Property(e => e.Name)
				.HasMaxLength(20)
				.IsRequired();
		});

		modelBuilder.Entity<User>(entity =>
		{
			entity.ToTable(nameof(User));
			entity.HasKey(e => e.IdUser);

			entity.Property(e => e.FirstName)
				.HasMaxLength(50)
				.IsRequired();
			entity.Property(e => e.LastName)
				.HasMaxLength(50)
				.IsRequired();
			entity.Property(e => e.Email)
				.HasMaxLength(320)
				.IsRequired();
			entity.Property(e => e.Description)
				.HasMaxLength(1000);
			entity.Property(e => e.PictureURL)
				.HasMaxLength(300);
			entity.Property(e => e.Password)
				.HasMaxLength(200)
				.IsRequired();
			entity.Property(e => e.PhoneNumber)
				.HasMaxLength(15);
			entity.Property(e => e.RegisterToken)
				.HasMaxLength(100);
			entity.Property(e => e.ResetPasswordToken)
				.HasMaxLength(100);
		});

		modelBuilder.Entity<Workshop>(entity =>
		{
			entity.ToTable(nameof(Workshop));
			entity.HasKey(e => e.IdWorkshop);

			entity.Property(e => e.Name)
				.HasMaxLength(150)
				.IsRequired();
			entity.Property(e => e.Description)
				.HasColumnType("TEXT")
				.IsRequired();
			entity.HasOne(e => e.Room)
				.WithMany(r => r.Workshops)
				.HasForeignKey(e => e.RoomId);
			entity.HasOne(e => e.Picture)
				.WithMany(r => r.Workshops)
				.HasForeignKey(e => e.PictureId);
			entity.HasOne(e => e.Address)
				.WithMany(r => r.Workshops)
				.HasForeignKey(e => e.AddressId);
		});

		modelBuilder.Entity<Room>(entity =>
		{
			entity.ToTable(nameof(Room));
			entity.HasKey(e => e.IdRoom);

			entity.Property(e => e.Name)
				.HasMaxLength(100)
				.IsRequired();

			entity.HasOne(d => d.City)
				.WithMany(p => p.Rooms)
				.HasForeignKey(d => d.CityId);

			entity.HasMany(d => d.Workshops)
				.WithOne(p => p.Room)
				.HasForeignKey(p => p.RoomId);

		});


		DisableCascadeDeleteAndUpdate(modelBuilder);

		SeedData(modelBuilder);

		base.OnModelCreating(modelBuilder);
	}

	protected void DisableCascadeDeleteAndUpdate(ModelBuilder modelBuilder)
	{
		foreach (var entityType in modelBuilder.Model.GetEntityTypes())
		{
			foreach (var foreignKey in entityType.GetForeignKeys())
			{
				foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
			}
		}
	}

	private void SeedData(ModelBuilder modelBuilder)
	{
		// Codebooks
		modelBuilder.Entity<Country>().HasData(
			new Country { IdCountry = 1, Name = "Hrvatska" }
		);

		modelBuilder.Entity<City>().HasData(
			new City { IdCity = 1, Name = "Zagreb", CountryId = 1 },
			new City { IdCity = 2, Name = "Split", CountryId = 1 }
		);

		modelBuilder.Entity<Address>().HasData(
			new Address { IdAddress = 1, StreetName = "Buzinski prilaz", HouseNumber = "10", ZipCode = "10000", CityId = 1 },
			new Address { IdAddress = 2, StreetName = "Ulica Kralja Zvonimira", HouseNumber = "14 (7.kat)", ZipCode = "5000", CityId = 2 }
		);

		modelBuilder.Entity<Room>().HasData(
			new Room
			{
				IdRoom = 1,
				Name = "Yamato",
				CityId = 1
			},
			new Room
			{
				IdRoom = 2,
				Name = "Ragusa",
				CityId = 1
			},
			new Room
			{
				IdRoom = 3,
				Name = "Gradec",
				CityId = 1
			},
			new Room
			{
				IdRoom = 4,
				Name = "Serenity",
				CityId = 1
			},
			new Room
			{
				IdRoom = 5,
				Name = "Spalatos",
				CityId = 1
			},
			new Room
			{
				IdRoom = 6,
				Name = "Riva",
				CityId = 2
			}
		);

		modelBuilder.Entity<Preference>().HasData(
			new Preference { IdPreference = 1, Name = "BA" },
			new Preference { IdPreference = 2, Name = "DEV" },
			new Preference { IdPreference = 3, Name = "QA" },
			new Preference { IdPreference = 4, Name = "Interno" }
		);

		modelBuilder.Entity<Picture>().HasData(
			new Picture
			{
				IdPicture = 1,
				Url = "https://i.postimg.cc/y6bRFcqF/Ba1.png",
				Preference = 1,
			},
			new Picture
			{
				IdPicture = 2,
				Url = "https://i.postimg.cc/Pf1xqRbv/Ba2.png",
				Preference = 1,
			},
			new Picture
			{
				IdPicture = 3,
				Url = "https://i.postimg.cc/g0mLYKRP/Ba3.png",
				Preference = 1,
			},
			new Picture
			{
				IdPicture = 4,
				Url = "https://i.postimg.cc/9Mf49FJ8/Dev1.png",
				Preference = 2,
			},
			new Picture
			{
				IdPicture = 5,
				Url = "https://i.postimg.cc/pLNnSvLr/Dev2.png",
				Preference = 2,
			},
			new Picture
			{
				IdPicture = 6,
				Url = "https://i.postimg.cc/xd5JqbyN/Dev3.png",
				Preference = 2,
			},
			new Picture
			{
				IdPicture = 7,
				Url = "https://i.postimg.cc/2jMqqYvG/Qa1.png",
				Preference = 3,
			},
			new Picture
			{
				IdPicture = 8,
				Url = "https://i.postimg.cc/yYBN3ynQ/Qa2.png",
				Preference = 3,
			},
			new Picture
			{
				IdPicture = 9,
				Url = "https://i.postimg.cc/gjXnMt93/Qa3.png",
				Preference = 3,
			},
			new Picture
			{
				IdPicture = 10,
				Url = "https://i.postimg.cc/52qjkFrK/King1.png",
				Preference = 4,
			},
			new Picture
			{
				IdPicture = 11,
				Url = "https://i.postimg.cc/DwqbkNSg/King2.png",
				Preference = 4,
			},
			new Picture
			{
				IdPicture = 12,
				Url = "https://i.postimg.cc/pXjmzSJH/King3.png",
				Preference = 4,
			}

		);

		// Dummy data
		modelBuilder.Entity<Workshop>().HasData(
			new Workshop
			{
				IdWorkshop = 1,
				Name = "Uvod u Python",
				Description = "U ovom predavanju naučite sve osnove o Python programskom jeziku.",
				StartDateTime = new DateTime(2023, 9, 1, 9, 0, 0),
				EndDateTime = new DateTime(2023, 9, 1, 17, 0, 0),
				RoomId = 1,
				PictureId = 2,
				AddressId = 1,
				AccessLink = "https://www.udemy.com/topic/python/",
				EventType = 1,
				MaxAttendeesOffline = 30,
				MaxAttendeesOnline = 15
			},
			new Workshop
			{
				IdWorkshop = 2,
				Name = "Napredne baze podataka",
				Description = "Ova radionica zaranja duboko u teme znanosti o podacima, uključujući strojno učenje i umjetnu inteligenciju",
				StartDateTime = new DateTime(2023, 10, 15, 9, 0, 0),
				EndDateTime = new DateTime(2023, 10, 16, 16, 0, 0),
				RoomId = 2,
				PictureId = 4,
				AddressId = 2,
				AccessLink = "https://www.udemy.com/topic/data-science/",
				EventType = 2,
				MaxAttendeesOffline = 25,
				MaxAttendeesOnline = 30
			}
		);

		modelBuilder.Entity<WorkshopPreference>().HasData(
			new WorkshopPreference { WorkshopId = 1, PreferenceId = 1 },
			new WorkshopPreference { WorkshopId = 2, PreferenceId = 2 }
		);

		modelBuilder.Entity<User>().HasData(
			new User
			{
				IdUser = 1,
				FirstName = "Marijeta",
				LastName = "Miletić",
				Email = "marijeta@gmail.com",
				Password = "ABkmjOu/a3s0CRq2l8EkeBdD8A4IV+S0++qXrbYFMZ+9uvKIGTo9XVH7ur8TiAubAw==", //123 hashed
				PhoneNumber = "1234567890",
				Description = null,
				PictureURL = null,
				Role = 3,
				CreatedAt = new DateTime(2023, 8, 16),
				IsVerified = true,
			},
			new User
			{
				IdUser = 2,
				FirstName = "Luka",
				LastName = "Lukić",
				Email = "luka@gmail.com",
				Password = "ABkmjOu/a3s0CRq2l8EkeBdD8A4IV+S0++qXrbYFMZ+9uvKIGTo9XVH7ur8TiAubAw==", //123 hashed
				PhoneNumber = "09862166428",
				Description = "Priznati stručnjak u području informacijskih tehnologija s naglaskom na .NET tehnologijama. S više od desetljeća iskustva, predaje na nekoliko uglednih fakulteta i posjeduje certifikat za .NET. Osim akademske karijere, Luka je zaposlen u tvrtki King ICT već četiri godine. Tu je odigrao ključnu ulogu u mnogim projektima, od razvoja softverskih rješenja do vođenja timova. Njegova stručnost, fleksibilnost i sposobnost rješavanja kompleksnih problema čine ga izuzetno cijenjenim u industriji. Uz sve to, njegova pristupačnost i pedagoške vještine doprinose njegovoj popularnosti među studentima i kolegama. Luka je također aktivan u zajednici, gdje redovito dijeli svoje znanje kroz radionice i webinare. Ova kombinacija akademskih i profesionalnih postignuća čini ga jednim od vodećih stručnjaka u svom polju.",
				PictureURL = "https://d3but52g8hjy3q.cloudfront.net/blog/wp-content/uploads/2020/02/videos-teachers-768x432.jpg",
				Role = 2,
				CreatedAt = new DateTime(2023, 8, 16),
				IsVerified = true,
			}
		);

		modelBuilder.Entity<UserWorkshop>().HasData(
			new UserWorkshop
			{
				UserId = 1,
				WorkshopId = 1,
				AttendanceType = 1,
				IsHost = true,
			}
		);

		modelBuilder.Entity<Feedback>().HasData(
			new Feedback
			{
				IdFeedback = 1,
				UserId = 1,
				Comment = "Odlicna radionica, preporucam pogledati!",
				Rating = 5,
				WorkshopId = 1,
			}
		);


		modelBuilder.Entity<UserPreference>().HasData(
			new UserPreference
			{
				UserId = 1,
				PreferenceId = 1,
			}
		);

		
	}
}
