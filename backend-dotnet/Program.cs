using Hospital.Api.Data;
using Hospital.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Register In-Memory Hospital Store
builder.Services.AddSingleton<HospitalDataStore>();

// CORS configuration for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

// Multi-tenant middleware
app.UseMiddleware<TenantMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    service = ".NET 8 Hospital Core Web API",
    status = "healthy",
    architecture = "Multi-Tenant Enterprise SaaS",
    endpoints = new[]
    {
        "/api/v1/patients",
        "/api/v1/appointments",
        "/api/v1/vitals"
    }
}));

app.Run();
