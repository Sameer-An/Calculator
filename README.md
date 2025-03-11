# Scientific Calculator

A fully responsive scientific calculator web application with both basic and advanced mathematical functions, featuring a beautiful user interface and additional features like calculation history.

## Features

### Basic Calculator
- All basic arithmetic operations (addition, subtraction, multiplication, division)
- Percentage calculations
- Responsive design that works on all devices
- Beautiful UI with gradient background and glass-like interface
- Calculation history that persists between sessions
- Keyboard support for faster calculations
- Error handling for invalid operations like division by zero

### Scientific Calculator
- Trigonometric functions (sin, cos, tan)
- Inverse trigonometric functions (asin, acos, atan)
- Logarithmic functions (log, natural log)
- Power functions (square, power, 10^x)
- Square root calculation
- Constants (π, e)
- Switchable angle mode (DEG/RAD)
- Parentheses support for complex expressions

## How to Use

1. Open `index.html` in any modern web browser
2. Choose between Basic and Scientific mode using the toggle buttons
3. Use the calculator buttons to perform calculations:
   - Numbers (0-9) and decimal point
   - Operations (+, -, ×, ÷, %)
   - AC button to clear all
   - DEL button to delete the last digit
   - = button to calculate the result
4. For scientific calculations:
   - Use sin, cos, tan for trigonometric functions
   - Use asin, acos, atan for inverse trigonometric functions
   - Use ln for natural logarithm and log for base-10 logarithm
   - Use √ for square root, x² for square, xʸ for power, and 10ˣ for 10 to the power of x
   - Use π and e for constants
   - Toggle between DEG and RAD for angle modes
5. See your calculation history on the right side (or below on mobile devices)
6. Clear your history with the "Clear History" button

## Keyboard Support

The calculator supports keyboard input for faster calculations:

- Numbers 0-9 for digits
- `.` for the decimal point
- `+`, `-`, `*`, `/`, `%` for operations
- `^` for power (xʸ)
- `(` and `)` for parentheses
- `Enter` or `=` to calculate
- `Backspace` to delete
- `Escape` to clear all

## Browser Compatibility

This calculator works on all modern browsers including:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge
- Opera
- Mobile browsers

## Technical Details

- Built with pure HTML, CSS, and JavaScript
- No external libraries or dependencies
- Uses CSS Grid for responsive button layout
- Stores calculation history in localStorage
- Implements proper error handling for all mathematical operations
- Handles angle conversions between degrees and radians

## Customization

Feel free to customize the calculator by editing:

- `styles.css` to change colors, sizes, and layout
- `script.js` to modify functionality or add new features
- `index.html` to adjust the structure

## License

This project is open source and available for any use. 
