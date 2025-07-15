using Microsoft.AspNetCore.Identity;
using Meikan.Entities.Models;
using Meikan.Data;
using Microsoft.EntityFrameworkCore;
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
            builder.Services.AddAuthorization();
            builder.Services.AddAuthentication()
                .AddCookie(IdentityConstants.ApplicationScheme)
                .AddBearerToken(IdentityConstants.BearerScheme);
            builder.Services.AddIdentityCore<User>(options =>
            {
                options.Password.RequireDigit = true;       
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false; 
                options.Password.RequiredLength = 6;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<UserContext>()
            .AddApiEndpoints();

            builder.Services.AddDbContext<UserContext>(options => options.UseNpgsql(connectionString));

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapIdentityApi<User>();
            app.MapControllers();

            await SeedingExtension.SeedAdminUser(app.Services, app.Configuration);

            app.Run();
        }
    }
}
