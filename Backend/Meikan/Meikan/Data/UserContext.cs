using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Meikan.Entities.Models;
using Microsoft.EntityFrameworkCore;
namespace Meikan.Data
{
    public class UserContext : IdentityDbContext<User>
    {
        public UserContext(DbContextOptions<UserContext> options ) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("Meikan");
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
            });
        }
    }
}
