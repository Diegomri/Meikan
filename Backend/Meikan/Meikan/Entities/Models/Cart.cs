namespace Meikan.Entities.Models
{
    public class Cart
    {
        public Guid Id { get; set; }
        public required string UserId { get; set; }
        public DateOnly DateCreated { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public decimal TotalPrice { get; set; } = 0.0m;
        public required User User { get; set; }
        public List<CartProducts>? CartProducts { get; set; }
    }
}
