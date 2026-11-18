namespace Hospital.Api.Middleware;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Extract multi-tenant Hospital ID from header or use default
        if (context.Request.Headers.TryGetValue("X-Hospital-Id", out var hospitalId) && !string.IsNullOrWhiteSpace(hospitalId))
        {
            context.Items["HospitalId"] = hospitalId.ToString();
        }
        else
        {
            context.Items["HospitalId"] = "hosp-main-tenant-001";
        }

        await _next(context);
    }
}
