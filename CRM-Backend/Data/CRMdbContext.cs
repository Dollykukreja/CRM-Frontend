using CRM_Backend.Models;
using CRMBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CRM_Backend.Data
{
    public class CRMdbContext : DbContext
    {
        public CRMdbContext(DbContextOptions options) : base(options) 
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<CustomerContact> CustomerContacts { get; set; }

        public IEnumerable<object> SalesRecords { get; internal set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CustomerContact>()
                .HasOne(c => c.Customer)
                .WithMany(c => c.Contacts)
                .HasForeignKey(c => c.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
