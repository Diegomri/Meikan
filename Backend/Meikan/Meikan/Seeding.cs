using Meikan.Data;
using Meikan.Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text;
namespace Meikan
{
    public static class Seeding
    {
        public static async Task SeedAdminUser(IServiceProvider services, IConfiguration configuration)
        {
            using var scope = services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            var adminSection = configuration.GetSection("AdminInfo");
            var email = adminSection["Email"];
            var userName = adminSection["UserName"];
            var password = adminSection["Password"];

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(password))
            {
                return;
            }

            var adminRole = "admin";
            if (!await roleManager.RoleExistsAsync(adminRole))
            {
                await roleManager.CreateAsync(new IdentityRole(adminRole));
            }

            var existingUser = await userManager.FindByEmailAsync(email);
            if (existingUser == null)
            {
                var adminUser = new User
                {
                    UserName = userName,
                    Email = email,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, adminRole);
                }
                else
                {
                    var errors = new StringBuilder();
                    foreach (var error in result.Errors)
                    {
                        errors.AppendLine($"{error.Code}: {error.Description}");
                    }
                }
            }
            else
            {
                if (!await userManager.IsInRoleAsync(existingUser, adminRole))
                {
                    await userManager.AddToRoleAsync(existingUser, adminRole);
                }
            }
        }
    }
}
