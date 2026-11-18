using Hospital.Api.Data;
using Hospital.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly HospitalDataStore _store;

    public PatientsController(HospitalDataStore store)
    {
        _store = store;
    }

    private string CurrentHospitalId => HttpContext.Items["HospitalId"]?.ToString() ?? "hosp-main-tenant-001";

    [HttpGet]
    public IActionResult GetAll()
    {
        var patients = _store.Patients.Values
            .Where(p => p.HospitalId == CurrentHospitalId)
            .OrderByDescending(p => p.CreatedAt)
            .ToList();

        return Ok(patients);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        if (_store.Patients.TryGetValue(id, out var patient) && patient.HospitalId == CurrentHospitalId)
        {
            return Ok(patient);
        }
        return NotFound(new { error = "Patient not found" });
    }

    [HttpPost]
    public IActionResult Create([FromBody] Patient request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            return BadRequest(new { error = "FullName is required" });
        }

        request.Id = Guid.NewGuid();
        request.HospitalId = CurrentHospitalId;
        request.Mrn = $"MRN-{Random.Shared.Next(1000, 9999)}";
        request.CreatedAt = DateTime.UtcNow;
        request.UpdatedAt = DateTime.UtcNow;

        _store.Patients[request.Id] = request;
        return CreatedAtAction(nameof(GetById), new { id = request.Id }, request);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, [FromBody] Patient request)
    {
        if (!_store.Patients.TryGetValue(id, out var existing) || existing.HospitalId != CurrentHospitalId)
        {
            return NotFound(new { error = "Patient not found" });
        }

        existing.FullName = request.FullName;
        existing.Age = request.Age;
        existing.Gender = request.Gender;
        existing.Phone = request.Phone;
        existing.Email = request.Email;
        existing.BloodGroup = request.BloodGroup;
        existing.PrimaryCondition = request.PrimaryCondition;
        existing.Status = request.Status;
        existing.UpdatedAt = DateTime.UtcNow;

        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        if (_store.Patients.TryGetValue(id, out var patient) && patient.HospitalId == CurrentHospitalId)
        {
            _store.Patients.TryRemove(id, out _);
            return Ok(new { success = true, id });
        }
        return NotFound(new { error = "Patient not found" });
    }
}
