using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sports.Core
{
    public class Test
    {
        [Key]
        public int testId { get; set; }
        public string testType { get; set; }
        public string testDate { get; set; }

    }
}
