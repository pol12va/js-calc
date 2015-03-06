(function() {
    new Calculator();
}());

function Calculator() {
    if (!(this instanceof Calculator)) {
        return new Calculator();
    }

    var digitButtons = document.querySelectorAll(".calc-button"),
        operationButtons = document.querySelectorAll(".operation-button"),
        self = this;

    this.operators = ["+", "-", "*", "/", ","];
    this.o1 = ["*", "/"];                                           //operators with higher priority
    this.o2 = ["+", "-"];                                           //operators with lower priority
    this.expression = document.querySelector(".expression");
    this.clearButton = document.querySelector(".clear");
    this.commaButton = document.querySelector(".comma-button");
    this.digitButtonsArray = Array.prototype.slice.call(digitButtons);      //convert from Node[] to Array
    this.operationButtonsArray = Array.prototype.slice.call(operationButtons);
    this.resultButton = document.querySelector(".result");


    this.digitButtonsArray.forEach(function(cur) {
        cur.addEventListener("click", function() {
            self.expression.value += cur.value;
        });
    });

    this.operationButtonsArray.forEach(function(cur) {
        cur.addEventListener("click", function() {
            var expVal = self.expression.value;

            if (expVal.length > 0) {
                //to prevent two operators in a row
                if (!self.isLastSymbolOperator()) {
                    self.expression.value += cur.value;
                }
            }
        });
    });

    this.commaButton.addEventListener("click", function() {
        var expVal = self.expression.value,
            len = expVal.length;

        //if there expression is started with float value
        if (len === 0) {
            self.expression.value = "0" + this.value;
            return;
        }
        //for float values stars with 0
        if (self.isLastSymbolOperator() && expVal[expVal.length - 1] !== ",") {
            self.expression.value += "0" + this.value;
        } else {
            if (expVal[len - 1] !== ",") {
                self.expression.value += this.value;
            }
        }
    });

    this.clearButton.addEventListener("click", function() {
        self.expression.value = "";
        self.changeButtonsDisableStatus(false);
    });

    this.resultButton.addEventListener("click", function() {
        var out,
            expressionArray = this.expressionToArray();

        try {
            out = this.transformToPolandNotation(expressionArray);
            console.log(this.expression.value);
            console.log(out);

            this.expression.value = this.calculate(out).toString().replace(".", ",");    
        } catch (e) {
            console.error(e.message);
            this.expression.value = e.message;
            this.changeButtonsDisableStatus(true);
        }     
    }.bind(this)); 
}

Calculator.prototype.changeButtonsDisableStatus = function(status) {
    this.digitButtonsArray.forEach(function(cur) {
        cur.disabled = status;
    });
    this.operationButtonsArray.forEach(function(cur) {
        cur.disabled = status;
    });
    this.resultButton.disabled = status;   
};

Calculator.prototype.isOperator = function(elem) {
    return this.operators.indexOf(elem) !== -1 ? true : false;
};

Calculator.prototype.isLastSymbolOperator = function() {
    var expVal = this.expression.value;
    if (this.operators.indexOf(expVal[expVal.length - 1]) !== -1) {
        return true;
    }
    return false;
};

Calculator.prototype.expressionToArray = function() {
    var i,
        operatorsRegExp = /[*\/\+-]/g,
        expression = this.expression.value
        numbers = expression.split(operatorsRegExp),
        expressionArray = [],
        operators = expression.match(operatorsRegExp),
        numLen = numbers.length;

    //split expression in array with numbers and operators
    for (i = 0; i < numLen; i++) {
        expressionArray.push(numbers[i]);
        if (i < operators.length) {
            expressionArray.push(operators[i]);
        }
    } 

    return expressionArray;
};

Calculator.prototype.transformToPolandNotation = function(expressionArray) {
    if (!Array.isArray(expressionArray)) {
        throw new Error("Error: incorrect poland notation");
    }
    var stack = new Stack(),
        out = [];

    expressionArray.forEach(function(current) {
        if (this.operators.indexOf(current) === -1) {
            out.push(current);
        } else {
            if (this.o1.indexOf(current) !== -1) {
                if (this.o1.indexOf(stack.lastValue()) !== -1) {
                    out.push(stack.pop());
                }                   
            } else if (this.o2.indexOf(current) !== -1) {
                if (stack.lastValue() !== undefined) {
                    while (stack.lastValue() !== undefined) {
                        out.push(stack.pop());
                    }
                }
            }
            stack.push(current);
        }
    }.bind(this));

    while (stack.lastValue()) {
        out.push(stack.pop());
    }

    return out;
};

Calculator.prototype.calculate = function(polandNotationExpression) {
    if (!Array.isArray(polandNotationExpression)) {
        throw new Error("Error: incorrect poland notation");
    }
    var stack = new Stack();

   polandNotationExpression.forEach(function(current) {
        if (this.isOperator(current)) {
            var operand2 = parseFloat(stack.pop().toString().replace(",", ".")),
                operand1 = parseFloat(stack.pop().toString().replace(",", ".")),
                result = 0;
            switch (current) {
                case '+':
                    result = operand1 + operand2;
                    break;
                case '-':
                    result = operand1 - operand2;
                    break;
                case '*':
                    result = operand1 * operand2;
                    break;
                case '/':
                    if (operand2 !== 0) {
                        result = operand1 / operand2;  
                    } else {
                        console.log("Error: Dividing by zero");
                        throw new Error("Cannot divide by zero");
                    }
                    break;
                default:
                    throw new Error("Unexpected operation");    
            }
            stack.push(result);
            console.log(result);
        } else {
            stack.push(current);
        }
    }.bind(this));

    return stack.pop();                
};

function Stack() {
    if (!(this instanceof Stack)) {
        return new Stack();
    }
    this.stack = [];
}

Stack.prototype.push = function(elem) {
    this.stack.push(elem);
};

Stack.prototype.pop = function() {
    var len = this.stack.length,
        result = this.stack[len - 1];
    if (len > 0) {
        this.stack.length = len - 1;
    }
    return result;
};

Stack.prototype.lastValue = function() {
    var len = this.stack.length;
    if (len > 0) {
        return this.stack[len - 1];
    }
};