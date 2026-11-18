namespace Hospital.Api.Models;

public class VitalReading
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string HospitalId { get; set; } = "default-hospital";
    public Guid PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public int HeartRate { get; set; }
    public string BloodPressure { get; set; } = "120/80";
    public double Temperature { get; set; } = 98.6;
    public int Spo2 { get; set; } = 98;
    public int RespiratoryRate { get; set; } = 16;
    public string RecordedBy { get; set; } = "Nurse";
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
}
