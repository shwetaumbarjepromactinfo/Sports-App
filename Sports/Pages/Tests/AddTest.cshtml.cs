using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Sports.Data;
using Sports.Core;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Sports.Pages.Tests
{
    public class AddTestModel : PageModel
    {
        private readonly ITest ITestData;
        [BindProperty]
        public Test Test { get; set; }

        public IEnumerable<TestListData> TestListData { get; set; }

        [TempData]
        public string message { get; set; }

        public AddTestModel(ITest ITestData)
        {
            this.ITestData = ITestData;
        }
        public IActionResult OnGet()
        {
            Test = new Test();
            TestListData = ITestData.GetAll();
            return Page();

        }
        public IActionResult OnPost()
        {
            if(ModelState.IsValid)
            {
                ITestData.Add(Test);
                TempData["Message"] = "Successfully Saved!";
                ITestData.commit();
                return RedirectToPage("./AddTest");
            }
            return Page();

        }
    }
}