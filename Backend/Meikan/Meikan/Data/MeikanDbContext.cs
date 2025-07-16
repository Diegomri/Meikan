using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Meikan.Entities.Models;
using Microsoft.EntityFrameworkCore;
namespace Meikan.Data
{
    public class MeikanDbContext : IdentityDbContext<User>
    {
        public MeikanDbContext(DbContextOptions<MeikanDbContext> options ) : base(options)
        {
        }

        public DbSet<Product> Products {get; set; } 
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartProducts> CartProducts { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasDefaultSchema("Meikan");
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
            });

            modelBuilder.Entity<CartProducts>().HasKey(cp => new { cp.CartId, cp.ProductId });
            modelBuilder.Entity<CartProducts>()
                .HasOne(c => c.Cart)
                .WithMany(cp => cp.CartProducts)
                .HasForeignKey(cp => cp.CartId);
            modelBuilder.Entity<CartProducts>()
                .HasOne(p => p.Product)
                .WithMany(cp => cp.CartProducts)
                .HasForeignKey(cp => cp.ProductId);
        }

    }
}
