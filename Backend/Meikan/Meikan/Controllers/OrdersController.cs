using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Meikan.Entities.Dtos;
using Meikan.Entities.Models;
using Meikan.Data;
using System.Threading.Tasks;

namespace Meikan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly MeikanDbContext _context;

        public OrdersController(MeikanDbContext context)
        {
            _context = context;
        }

        [HttpGet("{OrderId}")]
        public async Task<IActionResult> GetOrderById(Guid OrderId)
        {

            Order order = await _context.Orders.FindAsync(OrderId);

            if (order == null)
            {
                return NotFound($"Producto con ID {OrderId} no encontrado.");
            }

            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateOrderDto orderDto)
        {
            if (orderDto == null)
            {
                return BadRequest("Product data is required.");
            }
            Order order = new Order
            {
                Id = Guid.NewGuid(),
                UserId = orderDto.UserId,
                CartId = orderDto.CartId,
                DateOrdered = orderDto.DateOrdered,
                Status = orderDto.Status,
                TotalPrice = orderDto.TotalPrice
            };
            _context.Orders.Add(order);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { OrderId = order.Id }, orderDto);
        }

    }
}
