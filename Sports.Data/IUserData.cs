using Sports.Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Sports.Data
{
    public interface IUserData
    {
        IEnumerable<User> GetAll(string userRoleType);

        User GetUserById(int userId);

        int commit();

    }
}
