using System.ComponentModel.DataAnnotations;

namespace Meikan.Entities.Dtos
{
    public record class UpdateUserDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? City { get; set; }
        public string? Street { get; set; }
        public string? Address { get; set; }
    }
}
