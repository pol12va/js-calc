function init() {
	var calc = new Calculator();
}

function Calculator() {
	if (!(this instanceof Calculator)) {
		return new Calculator();
	}
	var digitButtons = document.querySelectorAll(".calc-button"),
		operationButtons = document.querySelectorAll(".operation-button"),
		self = this;

	this.operators = ["+", "-", "*", "/", ","];
	this.o1 = ["*", "/"];											//operators with higher priority
	this.o2 = ["+", "-"];											//operators with lower priority
	this.expression = document.querySelector(".expression");
	this.clearButton = document.querySelector(".clear");
	this.commaButton = document.querySelector(".comma-button");
	this.digitButtonsArray = Array.prototype.slice.call(digitButtons);		//convert from Node[] to Array
	this.operationButtonsArray = Array.prototype.slice.call(operationButtons);
	this.resultButton = document.querySelector(".result");


	this.digitButtonsArray.forEach(function(cur) {
		cur.addEventListener("click", function() {
			self.expression.value += cur.value;
		});
	});

	this.operationButtonsArray.forEach(function(cur) {
		cur.addEventListener("click", function() {
			var expVal = self.expression.value,
				len = expVal.length;

			if (len > 0) {
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
	});

	this.resultButton.addEventListener("click", function() {
		var i,
			operatorsRegExp = /[*\/\+-]/g,
			expression = self.expression.value
			numbers = expression.split(operatorsRegExp), 
			stack = new Stack(),
			calculationStack = new Stack(),
			expressionArray = [],
			operators = expression.match(operatorsRegExp),
			out = [],
			numLen = numbers.length;

		//split expression in array with numbers and operators
		for (i = 0; i < numLen; i++) {
			expressionArray.push(numbers[i]);
			if (i < operators.length) {
				expressionArray.push(operators[i]);
			}
		}

		//transform array into Reverse Polish Notation
		expressionArray.forEach(function(current) {
			if (self.operators.indexOf(current) === -1) {
				out.push(current);
			} else {
				if (self.o1.indexOf(current) !== -1) {
					if (self.o1.indexOf(stack.lastValue()) !== -1) {
						out.push(stack.pop());
					}					
				} else if (self.o2.indexOf(current) !== -1) {
					if (stack.lastValue() !== undefined) {
						while (stack.lastValue() !== undefined) {
							out.push(stack.pop());
						}
					}
				}
				stack.push(current);
			}
		});
		while (stack.lastValue()) {
			out.push(stack.pop());
		}
		console.log(self.expression.value);
		console.log(out);

		//result calculation
		out.forEach(function(current) {
			if (self.isOperator(current)) {
				var operand2 = parseFloat(calculationStack.pop()),
				 	operand1 = parseFloat(calculationStack.pop()),
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
						result = operand1 + operand2;
						break;
					default:

				}
				calculationStack.push(result);
				console.log(result);
			} else {
				calculationStack.push(current);
			}
		});
		self.expression.value = calculationStack.pop();
	});	
}

Calculator.prototype.isOperator = function(elem) {
	return this.operators.indexOf(elem) !== -1 ? true : false;
}

Calculator.prototype.isLastSymbolOperator = function() {
	var expVal = this.expression.value;
	if (this.operators.indexOf(expVal[expVal.length - 1]) !== -1) {
		return true;
	}
	return false;
}

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
}