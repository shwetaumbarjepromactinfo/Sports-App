using Sports.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sports.Data
{
        public class InMemoryTestData : ITest
        {
            private readonly SportsDbContext db;

            public InMemoryTestData(SportsDbContext _db)
            {
                this.db = _db;
            }
            public Test Add(Test newTest)
            {
                db.Tests.Add(newTest);
                return newTest;
            }

            public int commit()
            {
                return db.SaveChanges();
            }

            public Test Delete(int testId)
            {
                var test = GetTestById(testId);
                if (test != null)
                {
                    db.Tests.Remove(test);
                }
                return test;
            }

            public IEnumerable<TestListData> GetAll()
            {
            return  from t in db.Tests
                    join d in db.TestDetails on t.testId equals d.testId into g
                    select new TestListData{
                        testId = t.testId,
                        testType = t.testType,
                        testDate = t.testDate,
                        count = g.Count()
                    };

            }

            public Test GetTestById(int testId)
            {
                return db.Tests.SingleOrDefault(t => t.testId == testId);
            }
        }
    }
