namespace Meikan.Entities.Dtos
{
    public record class CartProductDto
    {
        public Guid ProductId { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public required string ImgUrl { get; set; }
        public int Quantity { get; set; } 
    }
}
