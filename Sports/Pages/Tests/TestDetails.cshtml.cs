using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Sports.Core;
using Sports.Data;

namespace Sports.Pages.Tests
{
    public class TestDetailsModel : PageModel
    {
        private readonly ITestDetail TestDetailData;
        [BindProperty]
        public TestDetail TestDetails { get; set; }

        public Test Test { get; set; }
        public IEnumerable<AllData> allData { get; set; }
        public IEnumerable<User> users { get; set; }

        public TestDetailsModel(ITestDetail testDetailData)
        {
            this.TestDetailData = testDetailData;
        }
        public IActionResult OnGet(int? testId)
        {
            TestDetails = new TestDetail();
            
            if(testId.HasValue)
            {
                Test = TestDetailData.GetTest(testId.Value);
                allData = TestDetailData.GetAll(testId.Value);
                users = TestDetailData.GetUsersByTestId(testId.Value);
            }
            return Page();
        }

        public IActionResult OnPostAddAsync(int? testId)
        {
            if (ModelState.IsValid)
            {
                TestDetails.testId = testId.Value;
                TestDetailData.Add(TestDetails);
                TempData["Message"] = "Successfully Saved!";
                TestDetailData.commit();
                return RedirectToPage("./TestDetails");
            }
            return Page();
        }

        public IActionResult OnPostDeleteAsync(int? testId)
        {
            if (testId.HasValue)
            {
                Test = TestDetailData.GetTest(testId.Value);
                TestDetailData.DeleteTestByTestId(testId.Value);
                TempData["Message"] = "Successfully Saved!";
                TestDetailData.commit();
                return RedirectToPage("./AddTest");
            }
            return Page();
        }
    }
}