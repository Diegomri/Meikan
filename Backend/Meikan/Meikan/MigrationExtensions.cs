using Meikan.Data;
using Microsoft.EntityFrameworkCore;
namespace Meikan
{
    public static class MigrationExtensions
    {
        public static void ApplyMigrations(this IApplicationBuilder app)
        {
            using IServiceScope scope = app.ApplicationServices.CreateScope();
            using Data.MeikanDbContext context = scope.ServiceProvider.GetRequiredService<Data.MeikanDbContext>();
            context.Database.Migrate();
        }   
    }
}
