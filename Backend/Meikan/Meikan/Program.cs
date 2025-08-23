using Meikan.Data;
using Meikan.Entities.Dtos;
using Meikan.Entities.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer; 
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Meikan
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var connectionString = builder.Configuration.GetConnectionString("Meikan");

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true, 
        ClockSkew = TimeSpan.Zero,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

            builder.Services.AddAuthorization();


            builder.Services.AddIdentityCore<User>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false; 
                options.Password.RequiredLength = 6;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<MeikanDbContext>()
            .AddApiEndpoints();

            builder.Services.AddDbContext<MeikanDbContext>(options => options.UseNpgsql(connectionString));

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:5173")
                               .AllowAnyHeader()
                               .AllowAnyMethod()
                               .AllowCredentials(); 
                    });
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseRouting();
            app.UseCors("AllowSpecificOrigin");
            app.UseStaticFiles(); 

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapIdentityApi<User>();

            app.MapPost("/logout", async (SignInManager<User> signInManager) =>
            {
                await signInManager.SignOutAsync();
                return Results.Ok();
            })
            .WithName("Logout")
            .Produces(StatusCodes.Status200OK)
            .RequireAuthorization();

            app.MapPost("/api/register", async (
    UserManager<User> userManager,
    MeikanDbContext dbContext,
    CreateUserDto request) =>
            {
                if (await userManager.FindByEmailAsync(request.Email) is not null)
                {
                    return Results.Conflict(new { message = "El correo electrónico ya está en uso." });
                }

                using var transaction = await dbContext.Database.BeginTransactionAsync();

                try
                {
                    var newUser = new User
                    {
                        UserName = request.Email,
                        Email = request.Email,
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        City = request.City,
                        Street = request.Street,
                        Address = request.Address,
                        PhoneNumber = request.Phone
                    };

                    // Se intenta crear el usuario en la base de datos.
                    var result = await userManager.CreateAsync(newUser, request.Password);

                    // Si la creación del usuario falla (ej: la contraseña no es válida)
                    if (!result.Succeeded)
                    {
                        await transaction.RollbackAsync(); // Revertimos la transacción
                        return Results.ValidationProblem(result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description }));
                    }

                    // 3. Si el usuario se creó con éxito, creamos su carrito.
                    var newCart = new Cart
                    {
                        Id = Guid.NewGuid(),
                        UserId = newUser.Id,         // Asignamos el ID del usuario recién creado
                        User = newUser,              // Asignamos la instancia de navegación de EF Core
                        DateCreated = DateOnly.FromDateTime(DateTime.UtcNow), // Usamos UTC para el servidor
                        TotalPrice = 0.0m            // El total inicial es cero
                    };

                    // 4. Añadimos el carrito al contexto de la base de datos y guardamos.
                    dbContext.Carts.Add(newCart);
                    await dbContext.SaveChangesAsync();

                    // 5. Si todo fue exitoso, confirmamos la transacción.
                    await transaction.CommitAsync();

                    // Devolvemos el ID del usuario para que el frontend pueda usarlo.
                    return Results.Ok(new { UserId = newUser.Id });
                }
                catch (Exception ex)
                {
                    // 6. Si ocurre cualquier otro error, revertimos la transacción.
                    await transaction.RollbackAsync();

                    // Es una buena práctica registrar el error (logging no implementado aquí)
                    // Log.Error(ex, "Ocurrió una excepción durante el registro de usuario y carrito.");

                    return Results.Problem("Ocurrió un error inesperado al procesar su solicitud.", statusCode: 500);
                }
            })
.WithName("CustomRegister")
.Produces(StatusCodes.Status201Created)
.Produces(StatusCodes.Status409Conflict) // Conflict para email existente
.Produces(StatusCodes.Status400BadRequest)
.Produces(StatusCodes.Status500InternalServerError);

            app.MapGet("/api/account/info", async (
    UserManager<User> userManager,
    HttpContext httpContext) =>
            {
                var user = await userManager.GetUserAsync(httpContext.User);

                if (user is null)
                {
                    return Results.NotFound("Usuario no encontrado o no autenticado.");
                }

                // --- LÓGICA AÑADIDA ---
                // Obtenemos la lista de roles del usuario.
                var roles = await userManager.GetRolesAsync(user);

                var userInfo = new UserInfoDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = user.FullName,
                    Email = user.Email,
                    City = user.City,
                    Street = user.Street,
                    Address = user.Address,
                    Phone = user.PhoneNumber,
                    Roles = roles // Asignamos la lista de roles al DTO
                };

                return Results.Ok(userInfo);
            })
.WithName("GetAccountInfo")
.Produces<UserInfoDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .RequireAuthorization();


            app.MapPost("/api/login", async (
    [FromBody] LoginRequest request,
    UserManager<User> userManager,
    IConfiguration config) =>
            {
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
                {
                    return Results.Unauthorized();
                }

                // El usuario es válido, ahora generamos el token
                var userRoles = await userManager.GetRolesAsync(user);

                var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email),
    };

                foreach (var role in userRoles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                // --- AQUÍ SE ESTABLECE LA EXPIRACIÓN DE 24 HORAS ---
                var expires = DateTime.UtcNow.AddHours(24);

                var token = new JwtSecurityToken(
                    issuer: config["Jwt:Issuer"],
                    audience: config["Jwt:Audience"],
                    claims: claims,
                    expires: expires,
                    signingCredentials: creds
                );

                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenString = tokenHandler.WriteToken(token);

                return Results.Ok(new { token = tokenString });
            })
.WithName("Login")
.AllowAnonymous();

            // ... (justo después de tu app.MapGet("/api/account/info", ...))

            app.MapPut("/api/account/info", async (
                HttpContext httpContext,
                UserManager<User> userManager,
                [FromBody] UpdateUserDto updatedInfo) =>
            {
                // 1. Obtener el usuario autenticado a partir del token. Es la forma más segura.
                var user = await userManager.GetUserAsync(httpContext.User);
                if (user is null)
                {
                    return Results.Unauthorized();
                }

                // 2. Mapear los nuevos datos del DTO al objeto de usuario existente.
                user.FirstName = updatedInfo.FirstName;
                user.LastName = updatedInfo.LastName;
                user.PhoneNumber = updatedInfo.PhoneNumber;
                user.City = updatedInfo.City;
                user.Street = updatedInfo.Street;
                user.Address = updatedInfo.Address;

                // 3. Usar UserManager para actualizar el usuario. Esto maneja sellos de seguridad, etc.
                var result = await userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    // Si la actualización falla (raro, pero posible), devuelve los errores.
                    return Results.ValidationProblem(result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description }));
                }

                // 4. (Opcional pero recomendado) Devolver el objeto de usuario actualizado.
                //    Esto permite al frontend sincronizar su estado con los datos más recientes.
                var updatedUserDto = new UserInfoDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Phone = user.PhoneNumber,
                    City = user.City,
                    Street = user.Street,
                    Address = user.Address,
                    Roles = await userManager.GetRolesAsync(user)
                };

                return Results.Ok(updatedUserDto);
            })
            .WithName("UpdateAccountInfo")
            .RequireAuthorization(); // Asegura que solo usuarios logueados puedan llamar a este endpoint.

            app.MapControllers();

            await Seeding.SeedAdminUser(app.Services, app.Configuration);

            app.Run();
        }
    }
}