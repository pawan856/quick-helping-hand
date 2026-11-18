using Hospital.Api.Data;
using Hospital.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly HospitalDataStore _store;

    public AppointmentsController(HospitalDataStore store)
    {
        _store = store;
    }

    private string CurrentHospitalId => HttpContext.Items["HospitalId"]?.ToString() ?? "hosp-main-tenant-001";

    [HttpGet]
    public IActionResult GetAll()
    {
        var list = _store.Appointments.Values
            .Where(a => a.HospitalId == CurrentHospitalId)
            .OrderBy(a => a.ScheduledAt)
            .ToList();

        return Ok(list);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Appointment req)
    {
        req.Id = Guid.NewGuid();
        req.HospitalId = CurrentHospitalId;
        req.CreatedAt = DateTime.UtcNow;

        _store.Appointments[req.Id] = req;
        return Ok(req);
    }

    [HttpPut("{id}/status")]
    public IActionResult UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        if (_store.Appointments.TryGetValue(id, out var appt) && appt.HospitalId == CurrentHospitalId)
        {
            appt.Status = request.Status;
            return Ok(appt);
        }
        return NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        if (_store.Appointments.TryGetValue(id, out var appt) && appt.HospitalId == CurrentHospitalId)
        {
            _store.Appointments.TryRemove(id, out _);
            return Ok(new { success = true, id });
        }
        return NotFound();
    }
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = "Scheduled";
}
