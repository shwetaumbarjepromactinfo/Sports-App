using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sports.Core
{
    public class User
    {
        [Key]
        public int userId { get; set; }
        public string userName { get; set; }
        public string userRoleType { get; set; }
    }
}
