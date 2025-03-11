// Get DOM elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operation');
const historyList = document.getElementById('history-list');
const clearHistoryButton = document.getElementById('clear-history');
const basicModeBtn = document.getElementById('basic-mode');
const scientificModeBtn = document.getElementById('scientific-mode');
const basicModeButtons = document.querySelector('.basic-mode-buttons');
const scientificModeButtons = document.querySelector('.scientific-mode-buttons');

// Calculator state
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
        this.clear();
        this.updateHistoryDisplay();
        this.angleMode = 'DEG'; // DEG or RAD
    }

    // Clear calculator display and state
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    // Delete the last digit
    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
        this.updateDisplay();
    }

    // Append a number to current display
    appendNumber(number) {
        // Prevent multiple decimals
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Replace 0 with number, unless it's a decimal
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
        this.updateDisplay();
    }

    // Convert angle based on mode (DEG/RAD)
    convertAngle(angle) {
        if (this.angleMode === 'DEG') {
            return angle * (Math.PI / 180); // Convert degrees to radians
        }
        return angle; // Already in radians
    }

    // Special constants like PI and e
    insertConstant(constant) {
        switch (constant) {
            case 'π':
                this.currentOperand = Math.PI.toString();
                break;
            case 'e':
                this.currentOperand = Math.E.toString();
                break;
        }
        this.updateDisplay();
    }

    // Toggle between degrees and radians
    toggleAngleMode(mode) {
        this.angleMode = mode;
        // Show feedback to user about the current mode
        this.previousOperand = `Angle mode: ${this.angleMode}`;
        this.updateDisplay();
        setTimeout(() => {
            if (this.previousOperand === `Angle mode: ${this.angleMode}`) {
                this.previousOperand = '';
                this.updateDisplay();
            }
        }, 1500);
    }

    // Handle parentheses
    handleParenthesis(parenthesis) {
        if (this.currentOperand === '0') {
            this.currentOperand = parenthesis;
        } else {
            this.currentOperand = this.currentOperand.toString() + parenthesis;
        }
        this.updateDisplay();
    }

    // Handle single function operations (sin, cos, tan, log, ln, etc.)
    executeFunction(func) {
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(current)) return;
        
        let result;
        
        switch(func) {
            case 'sin':
                result = Math.sin(this.convertAngle(current));
                break;
            case 'cos':
                result = Math.cos(this.convertAngle(current));
                break;
            case 'tan':
                result = Math.tan(this.convertAngle(current));
                break;
            case 'asin':
                if (current < -1 || current > 1) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = this.angleMode === 'DEG' 
                    ? Math.asin(current) * (180 / Math.PI) 
                    : Math.asin(current);
                break;
            case 'acos':
                if (current < -1 || current > 1) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = this.angleMode === 'DEG' 
                    ? Math.acos(current) * (180 / Math.PI) 
                    : Math.acos(current);
                break;
            case 'atan':
                result = this.angleMode === 'DEG' 
                    ? Math.atan(current) * (180 / Math.PI) 
                    : Math.atan(current);
                break;
            case 'ln':
                if (current <= 0) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = Math.log(current);
                break;
            case 'log':
                if (current <= 0) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = Math.log10(current);
                break;
            case '√':
                if (current < 0) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'x²':
                result = Math.pow(current, 2);
                break;
            case '10ˣ':
                result = Math.pow(10, current);
                break;
        }
        
        // Add to history
        const calculationString = `${func}(${this.currentOperand}) = ${result}`;
        this.addToHistory(calculationString);
        
        // Update calculator state
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    // Choose operation to perform
    chooseOperation(operation) {
        // Handle special scientific calculator operations
        if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'log', '√', 'x²', '10ˣ'].includes(operation)) {
            this.executeFunction(operation);
            return;
        }
        
        // Handle constants like π and e
        if (['π', 'e'].includes(operation)) {
            this.insertConstant(operation);
            return;
        }
        
        // Handle parentheses
        if (operation === '(' || operation === ')') {
            this.handleParenthesis(operation);
            return;
        }
        
        // Handle angle mode toggles
        if (operation === 'rad' || operation === 'deg') {
            this.toggleAngleMode(operation.toUpperCase());
            return;
        }
        
        if (this.currentOperand === '0' && operation !== '%') return;
        
        // Handle percentage operation differently
        if (operation === '%') {
            const current = parseFloat(this.currentOperand);
            this.currentOperand = (current / 100).toString();
            this.updateDisplay();
            return;
        }
        
        // Handle power operation
        if (operation === 'xʸ') {
            if (this.previousOperand !== '') {
                this.calculate();
            }
            this.operation = '^';
            this.previousOperand = this.currentOperand;
            this.currentOperand = '0';
            this.updateDisplay();
            return;
        }
        
        // If there was a previous operation pending, calculate it first
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    // Perform calculation
    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        // Don't calculate if inputs are invalid
        if (isNaN(prev) || isNaN(current)) return;
        
        // Perform the appropriate operation
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                // Handle division by zero
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        // Round result to avoid floating point issues
        computation = Math.round(computation * 1000000) / 1000000;
        
        // Save to history
        const calculationString = `${this.previousOperand} ${this.operation === '^' ? '^' : this.operation} ${this.currentOperand} = ${computation}`;
        this.addToHistory(calculationString);
        
        // Update calculator state
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    // Add calculation to history
    addToHistory(calculation) {
        this.history.unshift(calculation); // Add at the beginning
        if (this.history.length > 10) {
            this.history.pop(); // Remove oldest if more than 10 entries
        }
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
        this.updateHistoryDisplay();
    }

    // Update history display
    updateHistoryDisplay() {
        historyList.innerHTML = '';
        this.history.forEach(calculation => {
            const listItem = document.createElement('li');
            listItem.textContent = calculation;
            historyList.appendChild(listItem);
        });
    }

    // Format display number
    getDisplayNumber(number) {
        if (number === 'Error') return 'Error';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Update calculator display
    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            const displayOperation = this.operation === '^' ? 'xʸ' : this.operation;
            this.previousOperandElement.textContent = `${this.getDisplayNumber(this.previousOperand)} ${displayOperation}`;
        } else {
            this.previousOperandElement.textContent = this.previousOperand;
        }
    }
}

// Initialize calculator
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Toggle between basic and scientific modes
basicModeBtn.addEventListener('click', () => {
    basicModeBtn.classList.add('active');
    scientificModeBtn.classList.remove('active');
    basicModeButtons.classList.remove('hidden');
    scientificModeButtons.classList.add('hidden');
});

scientificModeBtn.addEventListener('click', () => {
    scientificModeBtn.classList.add('active');
    basicModeBtn.classList.remove('active');
    scientificModeButtons.classList.remove('hidden');
    basicModeButtons.classList.add('hidden');
});

// Add event listeners for number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
    });
});

// Add event listeners for operation buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Handle different operations
        if (button.dataset.action === 'clear') {
            calculator.clear();
        } else if (button.dataset.action === 'delete') {
            calculator.delete();
        } else if (button.dataset.action === '=') {
            calculator.calculate();
        } else {
            calculator.chooseOperation(button.dataset.action);
        }
    });
});

// Add event listener for clear history button
clearHistoryButton.addEventListener('click', () => {
    calculator.history = [];
    localStorage.removeItem('calculatorHistory');
    calculator.updateHistoryDisplay();
});

// Add keyboard support
document.addEventListener('keydown', event => {
    // Number keys (0-9)
    if (/^\d$/.test(event.key)) {
        calculator.appendNumber(event.key);
    }
    // Decimal point
    else if (event.key === '.') {
        calculator.appendNumber('.');
    }
    // Operations
    else if (event.key === '+') {
        calculator.chooseOperation('+');
    }
    else if (event.key === '-') {
        calculator.chooseOperation('-');
    }
    else if (event.key === '*') {
        calculator.chooseOperation('×');
    }
    else if (event.key === '/') {
        calculator.chooseOperation('÷');
    }
    else if (event.key === '%') {
        calculator.chooseOperation('%');
    }
    else if (event.key === '^') {
        calculator.chooseOperation('xʸ');
    }
    else if (event.key === '(') {
        calculator.chooseOperation('(');
    }
    else if (event.key === ')') {
        calculator.chooseOperation(')');
    }
    // Equal (Enter or =)
    else if (event.key === '=' || event.key === 'Enter') {
        event.preventDefault();
        calculator.calculate();
    }
    // Backspace for delete
    else if (event.key === 'Backspace') {
        calculator.delete();
    }
    // Escape for clear
    else if (event.key === 'Escape') {
        calculator.clear();
    }
}); 
