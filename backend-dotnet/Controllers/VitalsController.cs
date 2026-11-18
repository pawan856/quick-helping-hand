using Hospital.Api.Data;
using Hospital.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class VitalsController : ControllerBase
{
    private readonly HospitalDataStore _store;

    public VitalsController(HospitalDataStore store)
    {
        _store = store;
    }

    private string CurrentHospitalId => HttpContext.Items["HospitalId"]?.ToString() ?? "hosp-main-tenant-001";

    [HttpGet]
    public IActionResult GetAll([FromQuery] Guid? patientId)
    {
        var query = _store.Vitals.Values.Where(v => v.HospitalId == CurrentHospitalId);
        if (patientId.HasValue)
        {
            query = query.Where(v => v.PatientId == patientId.Value);
        }

        return Ok(query.OrderByDescending(v => v.RecordedAt).ToList());
    }

    [HttpPost]
    public IActionResult Record([FromBody] VitalReading req)
    {
        req.Id = Guid.NewGuid();
        req.HospitalId = CurrentHospitalId;
        req.RecordedAt = DateTime.UtcNow;

        _store.Vitals[req.Id] = req;
        return Ok(req);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        if (_store.Vitals.TryGetValue(id, out var v) && v.HospitalId == CurrentHospitalId)
        {
            _store.Vitals.TryRemove(id, out _);
            return Ok(new { success = true, id });
        }
        return NotFound();
    }
}
