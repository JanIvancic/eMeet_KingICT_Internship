using Microsoft.AspNetCore.Mvc;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;

namespace KingICT.Academy2023.eMeet.WebAPI.Controllers;

[Route("")]
[ApiController]
public class HomeController : ControllerBase
{
    private readonly IHostingEnvironment _hostingEnvironment;
    private readonly string _version;

    public HomeController(IHostingEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
		_version = typeof(HomeController).Assembly.GetName().Version.ToString();
    }

    [HttpGet]
    public IActionResult Index()
    {
        return Ok($"v{_version} ({_hostingEnvironment.EnvironmentName})");
    }
}
