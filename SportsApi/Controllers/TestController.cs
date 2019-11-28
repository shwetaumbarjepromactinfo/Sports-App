using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sports.Core;
using Sports.Data;

namespace SportsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly SportsDbContext _context;

        public TestController(SportsDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Test>> PostTest(Test test)
        {
            _context.Tests.Add(test);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTest), new { testId = test.testId }, test);
        }

        [HttpGet]
        public async Task<IEnumerable<TestListData>> GetTests()
        {
            var tests = await (from t in _context.Tests
                                                     join d in _context.TestDetails on t.testId equals d.testId into g
                                                     select new TestListData
                                                     {
                                                         testId = t.testId,
                                                         testType = t.testType,
                                                         testDate = t.testDate,
                                                         count = g.Count()
                                                     }).OrderBy(u => u.testId).ToListAsync(); ;
            return tests;
        }

        [HttpGet("{testId}")]
        public async Task<ActionResult<Test>> GetTest(int testId)
        {
            var test = await _context.Tests.FindAsync(testId);
            if(test == null)
            {
                return NotFound();
            }

            return test;
        }

        [HttpDelete("{testId}")]
        public async Task<ActionResult<Test>> DeleteTest(int testId)
        {
            var test = await _context.Tests.FindAsync(testId);
            if(test==null)
            {
                return NotFound();
            }
            _context.Tests.Remove(test);
            await _context.SaveChangesAsync();
            return test;
        }
    }
}