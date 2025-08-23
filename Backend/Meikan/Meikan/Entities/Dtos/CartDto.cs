namespace Meikan.Entities.Dtos
{
    public record class CartDto
    {
        public Guid CartId { get; set; }
        public decimal TotalPrice { get; set; }
        public List<CartProductDto> Products { get; set; } = new();
    }
}
