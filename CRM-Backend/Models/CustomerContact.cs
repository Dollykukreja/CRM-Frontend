using System.Text.Json.Serialization;

namespace CRMBackend.Models
{
    public class CustomerContact
    {
        public int Id { get; set; }
        public string Type { get; set; } = "Email"; // "Email" or "Phone"
        public string Value { get; set; } = string.Empty;

        // FK
        public int CustomerId { get; set; }

        [JsonIgnore]
        public Customer Customer { get; set; }
    }
}
