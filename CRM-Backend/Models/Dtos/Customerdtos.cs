namespace CRMBackend.Models.Dtos
{

    public class ContactDto
    {
        public string Type { get; set; } = ""; // "Email" or "Phone"
        public string Value { get; set; } = "";
    }
    public class CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        //public string Email { get; set; }
        //public string Phone { get; set; }

        public string Address { get; set; }
        public string Company { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ContactDto> Contacts { get; set; } = new();
    }

    public class CreateCustomerDto
    {
        public string Name { get; set; } = string.Empty;
        //public string Email { get; set; } = string.Empty;
        //public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public List<ContactDto> Contacts { get; set; } = new();
    }

    public class UpdateCustomerDto : CreateCustomerDto { }
}
