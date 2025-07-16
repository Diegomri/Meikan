namespace Meikan.Entities.Dtos
{
    public record class CreateProductDto
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public int Stock { get; set; }
        public decimal Price { get; set; }
        public required string Type { get; set; }
        public required string ImgUrl { get; set; }
    }
}
