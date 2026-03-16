using bookstore.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Let the React frontend talk to this API while you test locally.
builder.Services.AddCors(options =>
{
    options.AddPolicy("BookstoreFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173",
                "http://localhost:4173",
                "https://localhost:4173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Connect the API to the SQLite bookstore database for this assignment.
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));
builder.Services.AddControllers();

// Keep the API docs available while you are building and testing.
builder.Services.AddOpenApi();

var app = builder.Build();

// Only turn on the API docs while you are in development.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Allow browser requests from the frontend before hitting your controllers.
app.UseCors("BookstoreFrontend");

app.UseAuthorization();

// Turn on your controller routes so endpoints like /books are available.
app.MapControllers();

app.Run();
