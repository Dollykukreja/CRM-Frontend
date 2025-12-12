// Models/Dtos/LoginResponse.cs
namespace CRMBackend.Models.Dtos
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? Role { get; set; }   // "Admin", "SalesRep", "SupportUser"
        public string? Token { get; set; }  // optional: JWT or other token
    }
}
