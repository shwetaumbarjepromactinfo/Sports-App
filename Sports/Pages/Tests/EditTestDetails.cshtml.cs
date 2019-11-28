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
    public class EditTestDetailsModel : PageModel
    {
        private readonly ITestDetail TestDetailData;
        [BindProperty]
        public TestDetail testDetail { get; set; }

        public Test Test { get; set; }
        public IEnumerable<AllData> allData { get; set; }
        public IEnumerable<User> users { get; set; }

        public EditTestDetailsModel(ITestDetail testDetailData)
        {
            this.TestDetailData = testDetailData;
        }
        public IActionResult OnGet(int? testDetailId)
        {


            if (testDetailId.HasValue)
            {
                testDetail = TestDetailData.GetTestDetailById(testDetailId.Value);
                users = TestDetailData.GetUsersByTestDetailId(testDetailId.Value);
            }
            return Page();
        }

        public IActionResult OnPostEditAsync(int? testDetailId)
        {
            if (ModelState.IsValid)
            {
                TestDetailData.Update(testDetail);
                TempData["Message"] = "Successfully Saved!";
                TestDetailData.commit();
                return RedirectToPage("./TestDetails",new { testId = testDetail.testId });
            }
            return Page();
        }

        public IActionResult OnPostDeleteAsync(int? testDetailId)
        {
            if (testDetailId.HasValue)
            {
                testDetail = TestDetailData.GetTestDetailById(testDetailId.Value);
                TestDetailData.Delete(testDetailId.Value);
                TempData["Message"] = "Successfully Saved!";
                TestDetailData.commit();
                return RedirectToPage("./TestDetails", new { testId = testDetail.testId });
            }
            return Page();
        }
    }
}