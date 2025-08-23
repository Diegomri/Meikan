using Meikan.Data;
using Meikan.Entities.Dtos;
using Meikan.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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
        public async Task<IActionResult> GetProducts(
    [FromQuery] string? line,     // Para filtrar por "Facial" o "Corporal"
    [FromQuery] string? sortBy,   // Para ordenar por "name" o "price"
    [FromQuery] string? order)    // Para ordenar "asc" o "desc"
        {
            // 1. Empezamos con una consulta base IQueryable.
            //    Esto no ejecuta nada en la BD todavía, solo construye la consulta.
            var query = _context.Products.AsQueryable();

            // 2. Aplicar el filtro de línea (Type) si se proporciona.
            if (!string.IsNullOrEmpty(line) && line.ToLower() != "todos")
            {
                query = query.Where(p => p.Type.ToLower() == line.ToLower());
            }

            // 3. Aplicar el ordenamiento.
            if (!string.IsNullOrEmpty(sortBy))
            {
                bool isDescending = order?.ToLower() == "desc";

                query = sortBy.ToLower() switch
                {
                    "price" => isDescending
                        ? query.OrderByDescending(p => p.Price)
                        : query.OrderBy(p => p.Price),
                    "name" => isDescending
                        ? query.OrderByDescending(p => p.Name)
                        : query.OrderBy(p => p.Name),
                    _ => query // Si el sortBy no es válido, no hacemos nada.
                };
            }

            // 4. Ahora sí, ejecutamos la consulta final en la base de datos.
            var products = await query.ToListAsync();

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
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto productDto)
        {
            if (!ModelState.IsValid) // Buena práctica: comprobar si el modelo es válido
            {
                return BadRequest(ModelState);
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

            // --- CORRECCIÓN CLAVE ---
            // En lugar de devolver el `productDto`, devuelve el objeto `product` completo.
            // Este objeto ya tiene el `Id` que generó la base de datos.
            return CreatedAtAction(nameof(GetProductsById), new { ProductId = product.Id }, product);
        }

        [Authorize]
        [HttpPost("AddToCart")]
        public async Task<IActionResult> AddProductToCart([FromBody] AddToCartDto dto, string UserId)
        {
            var user = await _context.Users.FindAsync(UserId);
            if (user == null) return Unauthorized();

            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == user.Id);
            if (cart == null) return NotFound("Carrito no encontrado.");

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null) return NotFound("Producto no encontrado.");


            // --- LÓGICA CORREGIDA ---

            // 1. Busca si ya existe una entrada para este producto en este carrito.
            var existingEntry = await _context.CartProducts
                .FirstOrDefaultAsync(cp => cp.CartId == cart.Id && cp.ProductId == dto.ProductId);

            if (existingEntry != null)
            {
                // 2. Si ya existe, simplemente incrementa su cantidad.
                existingEntry.Quantity++;
            }
            else
            {
                // 3. Si no existe, crea una NUEVA entrada con cantidad inicial 1.
                var newEntry = new CartProducts
                {
                    Id = Guid.NewGuid(), // No olvides el nuevo Id
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
                    Quantity = 1 // <-- ¡ESTA ES LA CORRECCIÓN CLAVE!
                };
                _context.CartProducts.Add(newEntry);
            }

            // 4. Esta lógica se ejecuta en ambos casos (incremento o nueva adición).
            // Opcional: Descontar stock al añadir al carrito.
            // product.Stock--; 

            cart.TotalPrice += product.Price;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Producto añadido al carrito." });
        }

        [Authorize(Roles = "admin")] // 1. Seguridad: Solo los administradores pueden llamar a este método.
        [HttpDelete] // 2. Usamos el método DELETE sobre la ruta base (api/products)
        public async Task<IActionResult> DeleteMultipleProducts([FromBody] DeleteProductsDto dto)
        {
            if (dto == null || !dto.ProductIds.Any())
            {
                return BadRequest("Se requiere una lista de IDs de productos.");
            }

            // 3. Encontrar todos los productos que coincidan con los IDs recibidos
            var productsToDelete = await _context.Products
                .Where(p => dto.ProductIds.Contains(p.Id))
                .ToListAsync();

            if (!productsToDelete.Any())
            {
                return NotFound("No se encontraron productos con los IDs proporcionados.");
            }

            // 4. Eliminarlos del contexto. Gracias a la eliminación en cascada,
            //    las entradas relacionadas en CartProducts se eliminarán automáticamente.
            _context.Products.RemoveRange(productsToDelete);

            // 5. Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            // 204 No Content es una respuesta estándar y correcta para una eliminación exitosa.
            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file, [FromServices] IWebHostEnvironment env)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No se ha seleccionado ningún archivo.");

            // --- CORRECCIÓN Y ROBUSTEZ ---

            // 1. Verificar que la ruta raíz web (wwwroot) está disponible.
            if (string.IsNullOrEmpty(env.WebRootPath))
            {
                // Esto indica un problema de configuración del servidor.
                // La carpeta 'wwwroot' podría no existir en la raíz del proyecto.
                return StatusCode(StatusCodes.Status500InternalServerError, "La ruta de contenido web (wwwroot) no está configurada en el servidor.");
            }

            // 2. Construir la ruta al directorio de imágenes y asegurarse de que exista.
            var uploadPath = Path.Combine(env.WebRootPath, "images");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath); // Crea la carpeta 'images' si no existe.
            }

            // 3. Crear un nombre de archivo único para evitar colisiones.
            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            // 4. Combinar la ruta del directorio con el nuevo nombre de archivo.
            var filePath = Path.Combine(uploadPath, uniqueFileName);

            // 5. Guardar el archivo en el disco.
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // 6. Construir y devolver la URL pública de la imagen.
            var imageUrl = $"{Request.Scheme}://{Request.Host}/images/{uniqueFileName}";

            return Ok(new { url = imageUrl });
        }
    }
}
