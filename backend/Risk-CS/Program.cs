using Microsoft.EntityFrameworkCore;
using Risk.Data;
using Risk_CS.Services;
using System;

var builder = WebApplication.CreateBuilder(args);

 builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")).LogTo(Console.WriteLine));


builder.Services.AddControllers();

builder.Services.AddOpenApi();
builder.Services.AddSingleton<GameService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseRouting();


app.MapControllers();

app.Run();