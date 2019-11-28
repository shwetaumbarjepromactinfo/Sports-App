using Sports.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sports.Data
{
    public interface ITest
    {
        IEnumerable<TestListData> GetAll();

        Test GetTestById(int testId);

        Test Add(Test newTest);
        int commit();

        Test Delete(int testId);
    }

   
}
