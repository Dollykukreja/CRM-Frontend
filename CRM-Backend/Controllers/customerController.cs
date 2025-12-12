using CRM_Backend.Data;
using CRMBackend.Models;
using CRMBackend.Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRM_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly CRMdbContext _context;

        public CustomersController(CRMdbContext context)
        {
            _context = context;
        }
        [HttpGet("totalCustomers")]
        public IActionResult GetTotalCustomers()
        {
            var total = _context.Customers.Count();
            return Ok(new { total });
        }

        // ✅ Get all customers with contacts
        [HttpGet]
        public async Task<IActionResult> GetCustomers([FromQuery] string? search)
        {
            var query = _context.Customers
                .Include(c => c.Contacts)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c =>
                    c.Name.Contains(search) ||
                    c.Contacts.Any(ct => ct.Value.Contains(search)));
            }

            var customers = await query.ToListAsync();

            // Map entity → DTO
            var result = customers.Select(c => new CustomerDto
            {
                Id = c.Id,
                Name = c.Name,
                Address = c.Address,
                Company = c.Company,
                CreatedAt = c.CreatedAt,
                Contacts = c.Contacts.Select(ct => new ContactDto
                {
                    Type = ct.Type,
                    Value = ct.Value
                }).ToList()
            });

            return Ok(result);
        }

        // ✅ Create new customer with contacts
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerDto dto)
        {
            var customer = new Customer
            {
                Name = dto.Name,
                Company = dto.Company,
                Address = dto.Address,
                CreatedAt = DateTime.UtcNow,
                Contacts = dto.Contacts.Select(c => new CustomerContact
                {
                    Type = c.Type,
                    Value = c.Value
                }).ToList()
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(customer);
        }

        // ✅ Update customer & contacts
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] UpdateCustomerDto dto)
        {
            var existing = await _context.Customers
                .Include(c => c.Contacts)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existing == null) return NotFound();

            existing.Name = dto.Name;
            existing.Company = dto.Company;
            existing.Address = dto.Address;

            // Replace old contacts with new ones
            existing.Contacts.Clear();
            foreach (var contact in dto.Contacts)
            {
                existing.Contacts.Add(new CustomerContact
                {
                    Type = contact.Type,
                    Value = contact.Value
                });
            }

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // ✅ Delete customer (cascade delete contacts)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers
                .Include(c => c.Contacts)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null) return NotFound();

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
