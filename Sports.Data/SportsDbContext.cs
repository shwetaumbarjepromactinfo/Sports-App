using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Sports.Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sports.Data
{
    public class SportsDbContext : DbContext
    {
        public SportsDbContext(DbContextOptions<SportsDbContext> Options): base(Options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<TestDetail> TestDetails { get; set; }
    }

    public class SportsDbContextFactory : IDesignTimeDbContextFactory<SportsDbContext>
    {
        SportsDbContext IDesignTimeDbContextFactory<SportsDbContext>.CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<SportsDbContext>();
            optionsBuilder.UseSqlServer<SportsDbContext>("Server = (localdb)\\mssqllocaldb; Database = SportsDb; Trusted_Connection = False; MultipleActiveResultSets = true");

            return new SportsDbContext(optionsBuilder.Options);
        }
    }
}
