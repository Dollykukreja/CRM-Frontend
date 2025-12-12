using CRM_Backend.Models;
using System;

namespace CRMBackend.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        //public string Email { get; set; } = string.Empty;
        //public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<CustomerContact> Contacts { get; set; } = new List<CustomerContact>();
    }
}
