namespace Meikan.Entities.Dtos
{
    public record class DeleteProductsDto
    {
        public required List<Guid> ProductIds { get; set; }
    }
}
