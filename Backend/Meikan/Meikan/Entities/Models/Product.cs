namespace Meikan.Entities.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public int Stock { get; set; }
        public decimal Price { get; set; }
        public required string Type { get; set; }
        public required string ImgUrl { get; set; }
        public List<CartProducts>? CartProducts { get; set; }

    }
}
