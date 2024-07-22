using c_Project; // Ensure this namespace is correct
using Microsoft.AspNetCore.Mvc;

namespace c_Project.Controllers // Ensure your namespace matches your project's structure
{
    [ApiController]
    [Route("[controller]")]
    public class StringController : ControllerBase
    {
        private readonly StringProcessor _stringProcessor = new StringProcessor();

        [HttpGet("process")]
        public IActionResult ProcessString(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return BadRequest("Input string cannot be null or empty");
            }

            var reversedString = _stringProcessor.ReverseString(input);
            var isPalindrome = _stringProcessor.IsPalindrome(input);

            var result = new
            {
                ReversedString = reversedString,
                IsPalindrome = isPalindrome
            };

            return Ok(result);
        }
    }
}
