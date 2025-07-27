using Meikan.Data;
using Meikan.Entities.Dtos;
using Meikan.Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

//deescuentos
//regalos por compras

namespace Meikan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly MeikanDbContext _context;

        public CartsController(MeikanDbContext context)
        {
            _context = context;
        }
        [HttpGet("{CartId}")]
        public async Task<IActionResult> GetCartsById(Guid CartId)
        {

            Cart cart = await _context.Carts.FindAsync(CartId);

            if (cart == null)
            {
                return NotFound($"Cart con ID {CartId} no encontrado.");
            }

            return Ok(cart);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCart([FromBody] CreateCartDto cartDto)
        {
            if (cartDto == null)
            {
                return BadRequest("Product data is required.");
            }

            var existingUser = await _context.Users.FindAsync(cartDto.UserId);
            if (existingUser == null)
            {
                return BadRequest("User with the provided UserId does not exist.");
            }
            Cart cart = new Cart
            {
                Id = Guid.NewGuid(),
                UserId = cartDto.UserId,
                DateCreated = cartDto.DateCreated,
                TotalPrice = cartDto.TotalPrice,
                User = existingUser,
                CartProducts = new List<CartProducts>()
            };

            _context.Carts.Add(cart);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCartsById), new { CartId = cart.Id }, cartDto);
        }

        [HttpPut("AddProducts")]
        public async Task<IActionResult> AddProducts(Guid CartId, Guid ProductId, int Quantity)
        {
            Cart cart = await _context.Carts
                            .Include(c => c.CartProducts)
                            .FirstOrDefaultAsync(c => c.Id == CartId);
            if (cart == null)
            {
                return NotFound($"Cart with ID {CartId} not found.");
            }
            Product product = await _context.Products
                            .Include(c => c.CartProducts)
                            .FirstOrDefaultAsync(p => p.Id == ProductId);
            if (product == null)
            {
                return NotFound($"Product with ID {ProductId} not found.");
            }
            if (product.Stock < Quantity)
            {
                return BadRequest($"Insufficient stock for product {product.Name}. Available stock: {product.Stock}");
            }
            CartProducts cartProduct = new CartProducts
            {
                CartId = cart.Id,
                ProductId = product.Id,
                Cart = cart,
                Product = product
            };
            cart.CartProducts.Add(cartProduct);
            
            product.CartProducts.Add(cartProduct);
            
            product.Stock -= Quantity;

            _context.CartProducts.Add(cartProduct);

            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpPut("DeleteProducts")]
        public async Task<IActionResult> DeleteProducts(Guid CartId, Guid ProductId, int Quantity)
        {
            Cart cart = await _context.Carts
                            .Include(c => c.CartProducts)
                            .FirstOrDefaultAsync(c => c.Id == CartId);
            if (cart == null)
            {
                return NotFound($"Cart with ID {CartId} not found.");
            }
            Product product = await _context.Products
                            .Include(c => c.CartProducts)
                            .FirstOrDefaultAsync(p => p.Id == ProductId);
            if (product == null)
            {
                return NotFound($"Product with ID {ProductId} not found.");
            }
            if (product.Stock < Quantity)
            {
                return BadRequest($"Insufficient stock for product {product.Name}. Available stock: {product.Stock}");
            }
            CartProducts cartProduct = new CartProducts
            {
                CartId = cart.Id,
                ProductId = product.Id,
                Cart = cart,
                Product = product
            };
            cart.CartProducts.Remove(cartProduct);

            product.CartProducts.Remove(cartProduct);

            product.Stock += Quantity;

            _context.CartProducts.Remove(cartProduct);

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
