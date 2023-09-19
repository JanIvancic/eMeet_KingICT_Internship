using KingICT.Academy2023.eMeet.Messaging.Feedbacks;


namespace KingICT.Academy2023.eMeet.Contract
{
	public interface IFeedbackService
	{
		Task<List<FeedbackDTO>> GetAll();
		Task<List<FeedbackDTO>> GetAllByWorkshopId(int workshopId);
		Task Insert(CreateFeedbackVM entity);
	}
}
