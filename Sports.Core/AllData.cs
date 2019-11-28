using System;
using System.Collections.Generic;
using System.Text;

namespace Sports.Core
{
    public class AllData
    {
        public int userId { get; set; }
        public int testId { get; set; }
        public int testDetailId { get; set; }
        public string userName { get; set; }
        public string userRoleType { get; set; }
        public string testType { get; set; }

        public string testDate { get; set; }
        public long distance { get; set; }
    }
}
