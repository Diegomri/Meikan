using Meikan.Entities.Models;

namespace Meikan.Entities.Dtos
{
    public record class CreateOrderDto
    {
        public required string UserId { get; set; }
        public Guid CartId { get; set; }
        public DateOnly DateOrdered { get; set; }
        public string Status { get; set; } = "Pending";
        public decimal TotalPrice { get; set; }
    }
}
