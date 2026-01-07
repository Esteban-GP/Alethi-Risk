using Microsoft.EntityFrameworkCore;
using Risk.Data;
using Risk_CS.Middlewares;
using Risk_CS.Services;
using System;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")).LogTo(Console.WriteLine));


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        );
    });


builder.Services.AddOpenApi();
builder.Services.AddScoped<GameService>();
builder.Services.AddScoped<PlayerService>();
builder.Services.AddScoped<PrincedomService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ErrorHandlerMiddleware>();

app.UseHttpsRedirection();
app.UseRouting();


app.MapControllers();

app.Run();