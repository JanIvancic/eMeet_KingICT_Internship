using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace KingICT.Academy2023.eMeet.Repository.Migrations
{
    /// <inheritdoc />
    public partial class Initial_migration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Country",
                columns: table => new
                {
                    IdCountry = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Country", x => x.IdCountry);
                });

            migrationBuilder.CreateTable(
                name: "Picture",
                columns: table => new
                {
                    IdPicture = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Preference = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Picture", x => x.IdPicture);
                });

            migrationBuilder.CreateTable(
                name: "Preference",
                columns: table => new
                {
                    IdPreference = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Preference", x => x.IdPreference);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    IdUser = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    PictureURL = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Role = table.Column<byte>(type: "tinyint", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResetPasswordToken = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RegisterToken = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.IdUser);
                });

            migrationBuilder.CreateTable(
                name: "City",
                columns: table => new
                {
                    IdCity = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CountryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_City", x => x.IdCity);
                    table.ForeignKey(
                        name: "FK_City_Country_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Country",
                        principalColumn: "IdCountry",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserPreference",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PreferenceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPreference", x => new { x.PreferenceId, x.UserId });
                    table.ForeignKey(
                        name: "FK_UserPreference_Preference_PreferenceId",
                        column: x => x.PreferenceId,
                        principalTable: "Preference",
                        principalColumn: "IdPreference",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserPreference_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "IdUser",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Address",
                columns: table => new
                {
                    IdAddress = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StreetName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    HouseNumber = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    ZipCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Address", x => x.IdAddress);
                    table.ForeignKey(
                        name: "FK_Address_City_CityId",
                        column: x => x.CityId,
                        principalTable: "City",
                        principalColumn: "IdCity",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Room",
                columns: table => new
                {
                    IdRoom = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Room", x => x.IdRoom);
                    table.ForeignKey(
                        name: "FK_Room_City_CityId",
                        column: x => x.CityId,
                        principalTable: "City",
                        principalColumn: "IdCity",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Workshop",
                columns: table => new
                {
                    IdWorkshop = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    StartDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    EventType = table.Column<byte>(type: "tinyint", nullable: false),
                    MaxAttendeesOffline = table.Column<int>(type: "int", nullable: false),
                    MaxAttendeesOnline = table.Column<int>(type: "int", nullable: false),
                    IsCancelled = table.Column<bool>(type: "bit", nullable: false),
                    Availability = table.Column<bool>(type: "bit", nullable: false),
                    AccessLink = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    PictureId = table.Column<int>(type: "int", nullable: false),
                    AddressId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workshop", x => x.IdWorkshop);
                    table.ForeignKey(
                        name: "FK_Workshop_Address_AddressId",
                        column: x => x.AddressId,
                        principalTable: "Address",
                        principalColumn: "IdAddress",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Workshop_Picture_PictureId",
                        column: x => x.PictureId,
                        principalTable: "Picture",
                        principalColumn: "IdPicture",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Workshop_Room_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Room",
                        principalColumn: "IdRoom",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Feedback",
                columns: table => new
                {
                    IdFeedback = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Comment = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    WorkshopId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedback", x => x.IdFeedback);
                    table.ForeignKey(
                        name: "FK_Feedback_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "IdUser",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Feedback_Workshop_WorkshopId",
                        column: x => x.WorkshopId,
                        principalTable: "Workshop",
                        principalColumn: "IdWorkshop",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserWorkshop",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    WorkshopId = table.Column<int>(type: "int", nullable: false),
                    AttendanceType = table.Column<byte>(type: "tinyint", nullable: false),
                    IsHost = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserWorkshop", x => new { x.UserId, x.WorkshopId });
                    table.ForeignKey(
                        name: "FK_UserWorkshop_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "IdUser",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserWorkshop_Workshop_WorkshopId",
                        column: x => x.WorkshopId,
                        principalTable: "Workshop",
                        principalColumn: "IdWorkshop",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WorkshopPreference",
                columns: table => new
                {
                    WorkshopId = table.Column<int>(type: "int", nullable: false),
                    PreferenceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkshopPreference", x => new { x.WorkshopId, x.PreferenceId });
                    table.ForeignKey(
                        name: "FK_WorkshopPreference_Preference_PreferenceId",
                        column: x => x.PreferenceId,
                        principalTable: "Preference",
                        principalColumn: "IdPreference",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WorkshopPreference_Workshop_WorkshopId",
                        column: x => x.WorkshopId,
                        principalTable: "Workshop",
                        principalColumn: "IdWorkshop",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Country",
                columns: new[] { "IdCountry", "Name" },
                values: new object[] { 1, "Hrvatska" });

            migrationBuilder.InsertData(
                table: "Picture",
                columns: new[] { "IdPicture", "Preference", "Url" },
                values: new object[,]
                {
                    { 1, 1, "https://i.postimg.cc/y6bRFcqF/Ba1.png" },
                    { 2, 1, "https://i.postimg.cc/Pf1xqRbv/Ba2.png" },
                    { 3, 1, "https://i.postimg.cc/g0mLYKRP/Ba3.png" },
                    { 4, 2, "https://i.postimg.cc/9Mf49FJ8/Dev1.png" },
                    { 5, 2, "https://i.postimg.cc/pLNnSvLr/Dev2.png" },
                    { 6, 2, "https://i.postimg.cc/xd5JqbyN/Dev3.png" },
                    { 7, 3, "https://i.postimg.cc/2jMqqYvG/Qa1.png" },
                    { 8, 3, "https://i.postimg.cc/yYBN3ynQ/Qa2.png" },
                    { 9, 3, "https://i.postimg.cc/gjXnMt93/Qa3.png" },
                    { 10, 4, "https://i.postimg.cc/52qjkFrK/King1.png" },
                    { 11, 4, "https://i.postimg.cc/DwqbkNSg/King2.png" },
                    { 12, 4, "https://i.postimg.cc/pXjmzSJH/King3.png" }
                });

            migrationBuilder.InsertData(
                table: "Preference",
                columns: new[] { "IdPreference", "Name" },
                values: new object[,]
                {
                    { 1, "BA" },
                    { 2, "DEV" },
                    { 3, "QA" },
                    { 4, "Interno" }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "IdUser", "CreatedAt", "Deleted", "DeletedAt", "Description", "Email", "FirstName", "IsVerified", "LastName", "Password", "PhoneNumber", "PictureURL", "RegisterToken", "ResetPasswordToken", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(2023, 8, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, null, "marijeta@gmail.com", "Marijeta", true, "Miletić", "ABkmjOu/a3s0CRq2l8EkeBdD8A4IV+S0++qXrbYFMZ+9uvKIGTo9XVH7ur8TiAubAw==", "1234567890", null, null, null, (byte)3 },
                    { 2, new DateTime(2023, 8, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, "Priznati stručnjak u području informacijskih tehnologija s naglaskom na .NET tehnologijama. S više od desetljeća iskustva, predaje na nekoliko uglednih fakulteta i posjeduje certifikat za .NET. Osim akademske karijere, Luka je zaposlen u tvrtki King ICT već četiri godine. Tu je odigrao ključnu ulogu u mnogim projektima, od razvoja softverskih rješenja do vođenja timova. Njegova stručnost, fleksibilnost i sposobnost rješavanja kompleksnih problema čine ga izuzetno cijenjenim u industriji. Uz sve to, njegova pristupačnost i pedagoške vještine doprinose njegovoj popularnosti među studentima i kolegama. Luka je također aktivan u zajednici, gdje redovito dijeli svoje znanje kroz radionice i webinare. Ova kombinacija akademskih i profesionalnih postignuća čini ga jednim od vodećih stručnjaka u svom polju.", "luka@gmail.com", "Luka", true, "Lukić", "ABkmjOu/a3s0CRq2l8EkeBdD8A4IV+S0++qXrbYFMZ+9uvKIGTo9XVH7ur8TiAubAw==", "09862166428", "https://d3but52g8hjy3q.cloudfront.net/blog/wp-content/uploads/2020/02/videos-teachers-768x432.jpg", null, null, (byte)2 }
                });

            migrationBuilder.InsertData(
                table: "City",
                columns: new[] { "IdCity", "CountryId", "Name" },
                values: new object[,]
                {
                    { 1, 1, "Zagreb" },
                    { 2, 1, "Split" }
                });

            migrationBuilder.InsertData(
                table: "UserPreference",
                columns: new[] { "PreferenceId", "UserId" },
                values: new object[] { 1, 1 });

            migrationBuilder.InsertData(
                table: "Address",
                columns: new[] { "IdAddress", "CityId", "HouseNumber", "StreetName", "ZipCode" },
                values: new object[,]
                {
                    { 1, 1, "10", "Buzinski prilaz", "10000" },
                    { 2, 2, "14 (7.kat)", "Ulica Kralja Zvonimira", "5000" }
                });

            migrationBuilder.InsertData(
                table: "Room",
                columns: new[] { "IdRoom", "CityId", "Name" },
                values: new object[,]
                {
                    { 1, 1, "Yamato" },
                    { 2, 1, "Ragusa" },
                    { 3, 1, "Gradec" },
                    { 4, 1, "Serenity" },
                    { 5, 1, "Spalatos" },
                    { 6, 2, "Riva" }
                });

            migrationBuilder.InsertData(
                table: "Workshop",
                columns: new[] { "IdWorkshop", "AccessLink", "AddressId", "Availability", "Description", "EndDateTime", "EventType", "IsCancelled", "MaxAttendeesOffline", "MaxAttendeesOnline", "Name", "PictureId", "RoomId", "StartDateTime" },
                values: new object[,]
                {
                    { 1, "https://www.udemy.com/topic/python/", 1, false, "U ovom predavanju naučite sve osnove o Python programskom jeziku.", new DateTime(2023, 9, 1, 17, 0, 0, 0, DateTimeKind.Unspecified), (byte)1, false, 30, 15, "Uvod u Python", 2, 1, new DateTime(2023, 9, 1, 9, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, "https://www.udemy.com/topic/data-science/", 2, false, "Ova radionica zaranja duboko u teme znanosti o podacima, uključujući strojno učenje i umjetnu inteligenciju", new DateTime(2023, 10, 16, 16, 0, 0, 0, DateTimeKind.Unspecified), (byte)2, false, 25, 30, "Napredne baze podataka", 4, 2, new DateTime(2023, 10, 15, 9, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "Feedback",
                columns: new[] { "IdFeedback", "Comment", "Rating", "UserId", "WorkshopId" },
                values: new object[] { 1, "Odlicna radionica, preporucam pogledati!", 5, 1, 1 });

            migrationBuilder.InsertData(
                table: "UserWorkshop",
                columns: new[] { "UserId", "WorkshopId", "AttendanceType", "IsHost" },
                values: new object[] { 1, 1, (byte)1, true });

            migrationBuilder.InsertData(
                table: "WorkshopPreference",
                columns: new[] { "PreferenceId", "WorkshopId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Address_CityId",
                table: "Address",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_City_CountryId",
                table: "City",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_UserId",
                table: "Feedback",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_WorkshopId",
                table: "Feedback",
                column: "WorkshopId");

            migrationBuilder.CreateIndex(
                name: "IX_Room_CityId",
                table: "Room",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPreference_UserId",
                table: "UserPreference",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserWorkshop_WorkshopId",
                table: "UserWorkshop",
                column: "WorkshopId");

            migrationBuilder.CreateIndex(
                name: "IX_Workshop_AddressId",
                table: "Workshop",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Workshop_PictureId",
                table: "Workshop",
                column: "PictureId");

            migrationBuilder.CreateIndex(
                name: "IX_Workshop_RoomId",
                table: "Workshop",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkshopPreference_PreferenceId",
                table: "WorkshopPreference",
                column: "PreferenceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Feedback");

            migrationBuilder.DropTable(
                name: "UserPreference");

            migrationBuilder.DropTable(
                name: "UserWorkshop");

            migrationBuilder.DropTable(
                name: "WorkshopPreference");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Preference");

            migrationBuilder.DropTable(
                name: "Workshop");

            migrationBuilder.DropTable(
                name: "Address");

            migrationBuilder.DropTable(
                name: "Picture");

            migrationBuilder.DropTable(
                name: "Room");

            migrationBuilder.DropTable(
                name: "City");

            migrationBuilder.DropTable(
                name: "Country");
        }
    }
}
