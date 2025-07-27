using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Meikan.Entities.Dtos;
using Meikan.Entities.Models;
using Meikan.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;

namespace Meikan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly MeikanDbContext _context; 

        public ProductsController(MeikanDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            List<Product> products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        [HttpGet("{ProductId}")]
        public async Task<IActionResult> GetProductsById(Guid ProductId)
        {

            Product product = await _context.Products.FindAsync(ProductId);

            if (product == null)
            {
                return NotFound($"Producto con ID {ProductId} no encontrado.");
            }

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto productDto)
        {
            if (productDto == null)
            {
                return BadRequest("Product data is required.");
            }
            Product product = new Product
            {
                Id = Guid.NewGuid(),
                Name = productDto.Name,
                Description = productDto.Description,
                Stock = productDto.Stock,
                Price = productDto.Price,
                Type = productDto.Type,
                ImgUrl = productDto.ImgUrl
            };
            _context.Products.Add(product);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductsById), new { ProductId = product.Id }, productDto);
        }
            
    }
}
