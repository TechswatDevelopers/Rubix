namespace c_Project
{
    public class StringProcessor
    {
        public string ReverseString(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;
            char[] charArray = input.ToCharArray();
            Array.Reverse(charArray);
            return new string(charArray);
        }

        public bool IsPalindrome(string input)
        {
            if (string.IsNullOrEmpty(input)) return false;
            string reversed = ReverseString(input);
            return string.Equals(input, reversed, StringComparison.OrdinalIgnoreCase);
        }
    }
}
