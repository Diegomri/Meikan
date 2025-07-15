using Microsoft.AspNetCore.Identity;
namespace Meikan.Entities.Models
{
    public class User : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName => $"{FirstName} {LastName}".Trim();
        public string? City { get; set; }
        public string? Street { get; set; }
        public string? Address { get; set; }

    }
}
