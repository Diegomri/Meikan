using Meikan.Data;
using Meikan.Entities.Dtos;
using Meikan.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Meikan.Controllers
{
    [Authorize]
    [Route("api/cart")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly MeikanDbContext _context;
        private readonly UserManager<User> _userManager;

        public CartsController(MeikanDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserCart()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var cart = await _context.Carts
                .Include(c => c.CartProducts!)
                    .ThenInclude(cp => cp.Product)
                .FirstOrDefaultAsync(c => c.UserId == user.Id);

            if (cart == null) return NotFound("Carrito no encontrado.");

            var cartDto = new CartDto
            {
                CartId = cart.Id,
                TotalPrice = cart.TotalPrice,
                Products = cart.CartProducts!.Select(cp => new CartProductDto
                {
                    ProductId = cp.ProductId,
                    Name = cp.Product.Name,
                    Price = cp.Product.Price,
                    ImgUrl = cp.Product.ImgUrl,
                    Quantity = cp.Quantity 
                }).ToList()
            };

            return Ok(cartDto);
        }

        [HttpPost("products")]
        public async Task<IActionResult> AddProductToCart([FromBody] AddToCartDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == user.Id);
            if (cart == null) return NotFound("Carrito no encontrado.");
            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null) return NotFound("Producto no encontrado.");

            var existingEntry = await _context.CartProducts
                .FirstOrDefaultAsync(cp => cp.CartId == cart.Id && cp.ProductId == dto.ProductId);

            if (existingEntry != null)
            {
                existingEntry.Quantity++;
            }
            else
            {
                var newEntry = new CartProducts
                {
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
                    Quantity = 1 // La cantidad inicial siempre es 1
                };
                _context.CartProducts.Add(newEntry);
            }

            cart.TotalPrice += product.Price;
            // No necesitas tocar el stock aquí, eso debería manejarse al finalizar la compra.

            await _context.SaveChangesAsync();
            return Ok(new { message = "Producto añadido al carrito." });
        }

        [HttpDelete("products/{productId:guid}/one")]
        public async Task<IActionResult> RemoveOneProductItem(Guid productId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == user.Id);
            if (cart == null) return NotFound("Carrito no encontrado.");

            var entry = await _context.CartProducts
                .FirstOrDefaultAsync(cp => cp.CartId == cart.Id && cp.ProductId == productId);

            if (entry == null) return NotFound("Producto no encontrado en el carrito.");

            var product = await _context.Products.FindAsync(productId);
            if (product == null) return Problem("El producto asociado no existe.");

            // --- LÓGICA DE DECREMENTAR/ELIMINAR CORREGIDA ---
            if (entry.Quantity > 1)
            {
                // Si hay más de uno, solo decrementa la cantidad
                entry.Quantity--;
            }
            else
            {
                // Si solo queda uno, elimina la fila completa
                _context.CartProducts.Remove(entry);
            }

            cart.TotalPrice -= product.Price;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cantidad actualizada." });
        }

        // El endpoint para eliminar TODAS las instancias de un producto puede mantenerse
        // o ser eliminado si prefieres que el usuario solo pueda decrementar.
        // Lo dejo aquí por completitud.
        [HttpDelete("products/{productId:guid}")]
        public async Task<IActionResult> RemoveAllProductItems(Guid productId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == user.Id);
            if (cart == null) return NotFound("Carrito no encontrado.");

            var entry = await _context.CartProducts
                .FirstOrDefaultAsync(cp => cp.CartId == cart.Id && cp.ProductId == productId);

            if (entry == null) return NotFound("Producto no encontrado en el carrito.");

            var product = await _context.Products.FindAsync(productId);
            if (product == null) return Problem("El producto asociado no existe.");

            // Recalcular precio y eliminar
            cart.TotalPrice -= (product.Price * entry.Quantity);
            _context.CartProducts.Remove(entry);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Producto eliminado del carrito." });
        }
    }
}