using Meikan.Data;
using Microsoft.EntityFrameworkCore;
namespace Meikan
{
    public static class MigrationExtensions
    {
        public static void ApplyMigrations(this IApplicationBuilder app)
        {
            using IServiceScope scope = app.ApplicationServices.CreateScope();
            using UserContext context = scope.ServiceProvider.GetRequiredService<UserContext>();
            context.Database.Migrate();
        }   
    }
}
