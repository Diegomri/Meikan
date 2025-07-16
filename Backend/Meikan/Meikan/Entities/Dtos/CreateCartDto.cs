using Meikan.Entities.Models;

namespace Meikan.Entities.Dtos
{
    public record class CreateCartDto
    {
        public required string UserId { get; set; }
        public DateOnly DateCreated { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public decimal TotalPrice { get; set; } = 0.0m;
    }
}
