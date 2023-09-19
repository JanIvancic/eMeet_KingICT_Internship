using System;
using System.Collections.Generic;
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;
using sib_api_v3_sdk.Model;

namespace KingICT.Academy2023.eMeet.Infrastructure.MailUtility
{
	public class MailUtility
	{
		private readonly string _apiKey;
		private readonly TransactionalEmailsApi _apiInstance;

		public string MailFrom { get; set; }

		public MailUtility(string apiKey)
		{
			if (string.IsNullOrEmpty(apiKey))
				throw new ArgumentNullException(nameof(apiKey));

			_apiKey = apiKey;

			if (Configuration.Default.ApiKey.ContainsKey("api-key"))
			{
				Configuration.Default.ApiKey["api-key"] = _apiKey;
			}
			else
			{
				Configuration.Default.ApiKey.Add("api-key", _apiKey);
			}

			_apiInstance = new TransactionalEmailsApi();
		}

		public async System.Threading.Tasks.Task SendEmailUsingTemplate(string to, long templateId, Dictionary<string, object> templateParameters)
		{
			var sendSmtpEmail = new SendSmtpEmail
			{
				To = new List<SendSmtpEmailTo> { new SendSmtpEmailTo(to) },
				TemplateId = templateId,
				Params = templateParameters
			};

			try
			{
				var result = await _apiInstance.SendTransacEmailAsync(sendSmtpEmail);
				Console.WriteLine($"Email sent. Message ID: {result.MessageId}");
			}
			catch (Exception e)
			{
				Console.WriteLine($"Failed to send email. Error: {e.Message}");
				throw;
			}
		}
	}
}
