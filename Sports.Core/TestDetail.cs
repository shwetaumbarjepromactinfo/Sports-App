using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sports.Core
{
    public class TestDetail
    {
        [Key]
        public int testDetailId { get; set; }
        public int testId { get; set; }
        public int userId { get; set; }
        public long distance { get; set; }
    }
}
