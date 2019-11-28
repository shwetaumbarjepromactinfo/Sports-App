using Sports.Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Sports.Data
{
    public class InMemoryUserData : IUserData
    {
        private readonly SportsDbContext db;

        public InMemoryUserData(SportsDbContext _db)
        {
            this.db = _db;
        }
        public int commit()
        {
            return db.SaveChanges();
        }

        public IEnumerable<User> GetAll(string userRoleType)
        {
            return from u in db.Users
                   orderby u.userId
                   where u.userRoleType == userRoleType
                   select u;

        }

        public User GetUserById(int userId)
        {
            return db.Users.SingleOrDefault(u => u.userId == userId);
        }
    }
}
