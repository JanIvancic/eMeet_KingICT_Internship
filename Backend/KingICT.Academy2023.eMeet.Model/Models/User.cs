using KingICT.Academy2023.eMeet.Model.Enums;

namespace KingICT.Academy2023.eMeet.Models.Models;

public class User
{
    public int IdUser { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }

    public string PhoneNumber { get; set; }

    public string Description { get; set; }

    public string PictureURL { get; set; }

    public byte Role { get; set; }
     
    public bool Deleted { get; set; }
    public bool IsVerified { get; set; }

    public DateTime? DeletedAt { get; set; }

    public DateTime CreatedAt { get; set; }
    public string ResetPasswordToken { get; set; }
    public string RegisterToken { get; set; }


    public virtual ICollection<Feedback> Feedbacks { get; set; }

    public virtual ICollection<UserWorkshop> UserWorkshops { get; set; }

    public User() { }

	public User(string firstName, string lastName, string email, UserRoleEnum userRole, string userPassword, string phoneNumber, bool isVerified, string registerToken)
	{
		FirstName = firstName;
		LastName = lastName;
		Email = email;
		SetRole(userRole);
		Password = userPassword;
		PhoneNumber = phoneNumber;

		SetCreatedAt();
		IsVerified = isVerified;
		RegisterToken = registerToken;
	}

	private void SetRole(UserRoleEnum userRole)
    {
        Role = (byte)userRole;
    }

    private void SetCreatedAt()
    {
        CreatedAt = DateTime.Now;
    }
}
