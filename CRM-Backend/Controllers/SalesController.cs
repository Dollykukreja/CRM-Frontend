using CRM_Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;   
namespace CRM_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
  
    public class SalesController : ControllerBase
    {
        private readonly CRMdbContext _context;

        public SalesController(CRMdbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult health()
        {
            return Ok();
        }
    }
}
