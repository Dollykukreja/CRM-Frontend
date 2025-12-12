
using CRM_Backend.Data;
using CRM_Backend.Models.Dtos;
using CRMBackend.Models;
using CRMBackend.Models.Dtos;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CRM_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]


    public class AuthController : ControllerBase

    {
        private readonly CRMdbContext _context;
        private readonly IConfiguration _configuration;
     

        public AuthController(CRMdbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
           
        }

        [HttpPost]
        [Route("[action]")]
        public ActionResult<LoginResponse> Login([FromBody] LoginDto loginUser)
        {
            var cust = _context.Users.FirstOrDefault(x => x.Username == loginUser.Username && x.Password == loginUser.Password);

            if (cust == null)
            {
                return Unauthorized(new LoginResponse
                {
                    Success = false,
                    Message = "Invalid username or password"
                });
            }

            // later you can generate JWT, for now return dummy token
            var token = GenerateJwtToken(cust);
            return Ok(new LoginResponse
            {
                Success = true,
                Message = "Login successful",
                Role = cust.Role,
                Token = token
            });
        }
        private string GenerateJwtToken(User user)

        {
            var jwt = _configuration.GetSection("Jwt");
            var keyString = jwt["Key"];

            if (string.IsNullOrEmpty(keyString) || keyString.Length < 32)
                throw new Exception("JWT Key must be at least 32 characters long.");

            var keyBytes = Encoding.UTF8.GetBytes(keyString);
            var securityKey = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Role, user.Role ?? "User")
    };

            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwt["ExpireMinutes"] ?? "60")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Register([FromBody] User user)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Success = false, Message = "Invalid data" });

            // Check if email already exists
            if (_context.Users.Any(u => u.Email == user.Email))
            {
                return BadRequest(new RegisterResponse
                {
                    Success = false,
                    Message = "Email already registered. Please use a different email."
                });
            }

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new RegisterResponse
            {
                Success = true,
                Message = "User registered successfully"
            });
        }
        [HttpGet]
        [Route("[action]")]
        public IActionResult CheckEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest(new { exists = false, message = "Email is required" });

            var exists = _context.Users.Any(u => u.Email == email);
            return Ok(new { exists });
        }

    }
}
