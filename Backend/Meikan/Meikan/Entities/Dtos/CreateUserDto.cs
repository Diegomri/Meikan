namespace Meikan.Entities.Dtos
{
    public record class CreateUserDto
    {
        public required string Email { get; set; } 
        public required string Password { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName => $"{FirstName} {LastName}".Trim();
        public string? City { get; set; }
        public string? Street { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
    }
}
