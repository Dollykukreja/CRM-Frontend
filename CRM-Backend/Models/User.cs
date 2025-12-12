using System.ComponentModel.DataAnnotations;

namespace CRMBackend.Models
{
    public class User
    {
        [Key] 
        public int Id { get; set; }   // Primary Key
        public string Username { get; set; }     // Primary Key by convention
        public string Password { get; set; }
        

        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string Role { get; set; } 
    }
}
