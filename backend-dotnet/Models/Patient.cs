namespace Hospital.Api.Models;

public class Patient
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string HospitalId { get; set; } = "default-hospital";
    public string FullName { get; set; } = string.Empty;
    public string Mrn { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = "Male";
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? BloodGroup { get; set; }
    public string? PrimaryCondition { get; set; }
    public string Status { get; set; } = "Active"; // Active, Inactive, Discharged, Critical
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
