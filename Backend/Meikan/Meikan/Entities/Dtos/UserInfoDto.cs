namespace Meikan.Entities.Dtos
{
    public record class UserInfoDto
    {
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? City { get; set; }
        public string? Street { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public IList<string> Roles { get; set; } // <-- AÑADE ESTA LÍNEA
    }
}
