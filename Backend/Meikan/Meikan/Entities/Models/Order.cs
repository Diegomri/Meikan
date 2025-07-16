namespace Meikan.Entities.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public required string UserId { get; set; }
        public Guid CartId { get; set; }
        public DateOnly DateOrdered { get; set; }
        public string Status { get; set; } = "Pending";
        public decimal TotalPrice { get; set; }

    }
}
