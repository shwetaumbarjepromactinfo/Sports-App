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
    public class TestDetailController : ControllerBase
    {
        private readonly SportsDbContext _context;

        public TestDetailController(SportsDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<TestDetail>> PostTestDetail(TestDetail testDetail)
        {
            _context.TestDetails.Add(testDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTestDetailByTestDetailId), new { testDetailId = testDetail.testDetailId }, testDetail);
        }
        [HttpGet("GetTestDetailByTestId/{testId}")]
        
        public async Task<IEnumerable<AllData>> GetTestDetailByTestId(int testId)
        {
            var testDetails = await (_context.TestDetails.Join(_context.Users,
                d => d.userId,
                u => u.userId, (d, u) => new { d, u })
                .Join(_context.Tests,
                du => du.d.testId,
                t => t.testId,
                (du, t) => new { t, du.u, du.d })
                .Where(dut => dut.t.testId == testId)
                .Select(dut => new AllData
                {
                    userId = dut.u.userId,
                    userName = dut.u.userName,
                    userRoleType = dut.u.userRoleType,
                    testId = dut.t.testId,
                    testType = dut.t.testType,
                    testDate = dut.t.testDate,
                    distance = dut.d.distance,
                    testDetailId = dut.d.testDetailId
                }).ToListAsync());

            return testDetails;
        }

        [HttpGet("GetUserForTestDetailByTestId/{testDetailId}")]

        public async Task<IEnumerable<User>> GetUserForTestDetailByTestId(int testDetailId)
        {
            var testdetail = await _context.TestDetails.FindAsync(testDetailId);
            if (testdetail != null)
            {
                var id =   _context.TestDetails.Where(u => u.testId == testdetail.testId).Select(u => u.userId);
                var ids =  id.Where(val => val != testdetail.userId).ToArray();
                var record = await (from s in _context.Users
                              where !ids.Contains(s.userId)
                              orderby s.userName
                              select s).ToListAsync();
                return record;
            }
            else
            {
                var record = await  (from s in _context.Users
                              orderby s.userName
                              select s).ToListAsync();
                return record;
            }

        }

        [HttpGet("GetTestDetailByTestDetailId/{testDetailId}")]

        public async Task<ActionResult<TestDetail>> GetTestDetailByTestDetailId(int testDetailId)
        {
            var testDetail = await _context.TestDetails.FindAsync(testDetailId);
            if (testDetail == null)
            {
                return NotFound();
            }

            return testDetail;
        }

        [HttpPut("{testDetailId}")]
        public async Task<IActionResult> PutTestDetail(int testDetailId, TestDetail TestDetail)
        {
            if (testDetailId != TestDetail.testDetailId)
            {
                return BadRequest();
            }

            _context.Entry(TestDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!testDetailExists(testDetailId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpDelete("{testDetailId}")]

        public async Task<ActionResult<TestDetail>> DeleteTestDetail(int testDetailId)
        {
            var testDetail = await _context.TestDetails.FindAsync(testDetailId);
            if (testDetail == null)
            {
                return NotFound();
            }

            _context.TestDetails.Remove(testDetail);
            await _context.SaveChangesAsync();
            return testDetail;
        }

        private bool testDetailExists(int testDetailId)
        {
            var testDetail = _context.TestDetails.FindAsync(testDetailId);
            if(testDetail == null)
            {
                return false;
            }
            return true;
        }
    }
}