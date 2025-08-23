namespace Meikan.Entities.Models
{
    public class CartProducts
    {
        public Guid Id { get; set; }

        public int Quantity { get; set; }

        public Guid CartId { get; set; }
        public Cart Cart { get; set; } = null!;
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}
