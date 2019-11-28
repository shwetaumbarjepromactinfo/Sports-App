using Sports.Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Sports.Data
{
    public interface ITestDetail
    {
        IEnumerable<AllData> GetAll(int testId);

        TestDetail Update(TestDetail UpdatedTestDetail);

        IEnumerable<User> GetUsersByTestId(int testId);
        int commit();
        TestDetail GetTestDetailById(int testDetailId);

        IEnumerable<User> GetUsersByTestDetailId(int testDetailId);
        TestDetail Add(TestDetail newTestDetail);
        TestDetail Delete(int testDetailId);

        Test DeleteTestByTestId(int testId);

        Test GetTest(int testId);
        int GetCountOfTestDetails(int testId);
    }

    public class InMemoryTestDetailData : ITestDetail
    {
        private readonly SportsDbContext db;

        public InMemoryTestDetailData(SportsDbContext _db)
        {
            this.db = _db;
        }
        public TestDetail Add(TestDetail newTestDetail)
        {
            db.Add(newTestDetail);
            return newTestDetail;
        }

        public int commit()
        {
            return db.SaveChanges();
        }

        public TestDetail Delete(int testDetailId)
        {
            var testDetail = GetTestDetailById(testDetailId);
            if(testDetail != null)
            {
                db.TestDetails.Remove(testDetail);
            }
            return testDetail;
        }

        public Test DeleteTestByTestId(int testId)
        {
            var test = db.Tests.Find(testId); 
            if (test != null)
            {
                db.Tests.Remove(test);
                db.TestDetails.RemoveRange(db.TestDetails.Where(c => c.testId == testId));
            }
            return test;
        }

        public IEnumerable<AllData> GetAll(int testId)
        {
            return db.TestDetails.Join(db.Users,
                d => d.userId,
                u => u.userId, (d, u) => new { d, u })
                .Join(db.Tests,
                du => du.d.testId,
                t => t.testId,
                (du, t) => new { t, du.u, du.d })
                .Where(dut => dut.t.testId == testId)
                .Select(dut => new AllData
                {
                    userId=dut.u.userId,
                    userName=dut.u.userName,
                    userRoleType=dut.u.userRoleType,
                    testId=dut.t.testId,
                    testType=dut.t.testType,
                    testDate=dut.t.testDate,
                    distance=dut.d.distance,
                    testDetailId=dut.d.testDetailId
                }).ToList();
                

        }

        public int GetCountOfTestDetails(int testId)
        {
            return db.TestDetails.Count(u=>u.testId == testId);
        }

        public Test GetTest(int testId)
        {
            return db.Tests.SingleOrDefault(t => t.testId == testId);
        }

        public TestDetail GetTestDetailById(int testDetailId)
        {
            return db.TestDetails.Find(testDetailId);
        }

        public IEnumerable<User> GetUsersByTestDetailId(int testDetailId)
        {
            var testdetail = GetTestDetailById(testDetailId);
            if (testdetail != null)
            {
                var id = db.TestDetails.Where(u => u.testId == testdetail.testId).Select(u => u.userId);
                var ids = id.Where(val => val != testdetail.userId).ToArray();
                var record = (from s in db.Users
                              where !ids.Contains(s.userId)
                              orderby s.userName
                              select s).ToList();
                return record;
            }
            else
            {
                var record = (from s in db.Users
                              orderby s.userName
                              select s).ToList();
                return record;
            }
          
        }

        public IEnumerable<User> GetUsersByTestId(int testId)
        {
            var id = db.TestDetails.Where(u => u.testId == testId).Select(u => u.userId);

            var record = (from s in db.Users
                          where !id.Contains(s.userId)
                          orderby s.userName
                          select s).ToList();
            return record;
        }

        public TestDetail Update(TestDetail UpdatedTestDetail)
        {
            var entity = db.TestDetails.Attach(UpdatedTestDetail);
            entity.State = EntityState.Modified;
            return UpdatedTestDetail;
        }
    }
}
