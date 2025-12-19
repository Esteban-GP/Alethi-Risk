using Microsoft.EntityFrameworkCore;
using Risk_CS.Models;
using System;

namespace Risk.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Game> Games { get; set; }
        public DbSet<Player> Player { get; set; }
        public DbSet<Princedom> Princedoms { get; set; }
    }
}
