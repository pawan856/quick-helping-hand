using System.Collections.Concurrent;
using Hospital.Api.Models;

namespace Hospital.Api.Data;

public class HospitalDataStore
{
    public ConcurrentDictionary<Guid, Patient> Patients { get; } = new();
    public ConcurrentDictionary<Guid, Appointment> Appointments { get; } = new();
    public ConcurrentDictionary<Guid, VitalReading> Vitals { get; } = new();

    public HospitalDataStore()
    {
        SeedInitialData();
    }

    private void SeedInitialData()
    {
        var tenant = "hosp-main-tenant-001";

        var p1 = new Patient
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            HospitalId = tenant,
            FullName = "Rajesh Sharma",
            Mrn = "MRN-RS101",
            Age = 45,
            Gender = "Male",
            Phone = "+91 98765-43210",
            Email = "rajesh.sharma@hospital.com",
            BloodGroup = "B+",
            PrimaryCondition = "Hypertension",
            Status = "Active"
        };

        var p2 = new Patient
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            HospitalId = tenant,
            FullName = "Priya Patel",
            Mrn = "MRN-PP102",
            Age = 32,
            Gender = "Female",
            Phone = "+91 98765-43211",
            Email = "priya.patel@hospital.com",
            BloodGroup = "A+",
            PrimaryCondition = "Diabetes Type 2",
            Status = "Active"
        };

        var p3 = new Patient
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            HospitalId = tenant,
            FullName = "Arjun Singh",
            Mrn = "MRN-AS103",
            Age = 28,
            Gender = "Male",
            Phone = "+91 98765-43212",
            Email = "arjun.singh@hospital.com",
            BloodGroup = "O+",
            PrimaryCondition = "Asthma",
            Status = "Active"
        };

        Patients[p1.Id] = p1;
        Patients[p2.Id] = p2;
        Patients[p3.Id] = p3;

        var apt1 = new Appointment
        {
            Id = Guid.NewGuid(),
            HospitalId = tenant,
            PatientId = p1.Id,
            PatientName = p1.FullName,
            DoctorName = "Dr. Kapoor",
            ScheduledAt = DateTime.UtcNow.AddHours(2),
            DurationMinutes = 30,
            AppointmentType = "Consultation",
            Status = "Scheduled",
            Notes = "Check BP control"
        };
        Appointments[apt1.Id] = apt1;

        var v1 = new VitalReading
        {
            Id = Guid.NewGuid(),
            HospitalId = tenant,
            PatientId = p1.Id,
            PatientName = p1.FullName,
            HeartRate = 72,
            BloodPressure = "120/80",
            Temperature = 98.6,
            Spo2 = 98,
            RespiratoryRate = 16,
            RecordedBy = "Nurse Priya"
        };
        Vitals[v1.Id] = v1;
    }
}
