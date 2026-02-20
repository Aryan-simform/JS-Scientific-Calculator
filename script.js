const utilities = (function () {
    function formatNumber(number) {
        console.log("fmt", number, "typeof: ",typeof number);
        if (typeof number === Number) return "Error: Not a Number!";
        console.log(number);
        return (parseFloat(number));
    }

    function factorial(number) {
        console.log("fact: ",number)
        if (parseFloat(number) < 0) return "Error! Number must be integer";
        let res = BigInt(1);
        let i = BigInt(2);
        for (; i <= BigInt(number); i++) res *= i;
        return res;
    }

    return {
        formatNumber,
        factorial,
    };
})();

function createHistory() {
    let hist = JSON.parse(localStorage.getItem("calculationHistory")) || [];

    function SaveHistory() {
        localStorage.setItem("calculationHistory", JSON.stringify(hist));
    }
    return {
        add(entry) {
            // let saveVal=JSON.stringify((entry));
            hist.unshift(entry);
            SaveHistory();
        },
        get() {
            return hist;
        },
        clear() {

            hist = [];
            localStorage.setItem("calculationHistory", []);
            // localStorage.removeItem("calculationHistory");
            SaveHistory();
        },
    };
}
const history = new createHistory();
function basicOperations() { }
basicOperations.prototype.add = function (a, b) {
    return a + b;
};

basicOperations.prototype.subtract = function (a, b) {
    return a - b;
};

basicOperations.prototype.multiply = function (a, b) {
    return a * b;
};

basicOperations.prototype.divide = function (a, b) {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
};

basicOperations.prototype.mod = function (a, b) {
    return a % b;
};
basicOperations.prototype.power = (a, b) => a ** b;

basicOperations.prototype.mod = (a, b) => a % b;

class Calculator extends basicOperations {

    constructor() {
        super();
        this.clearFlag = false;
        this.current = "0";
        this.expression = "";
    }
    //set the current number and reset the clearFlag
    inputNumber(number) {
        if (this.clearFlag) {
            this.expression = "";
            this.clearFlag = false;
        }
        this.expression += number;
        this.current = this.expression || "0";
    }

    setOperator(op) {
        this.expression += op;
        this.current = this.expression;
    }
    calculate() {

        if (!this.expression) return;

        try {
            const postfix = this.infixToPostfix(this.tokenizer(this.expression));
            const result  = this.evaluatePostfix(postfix);

            history.add(`${this.expression}=${result}`);

            this.current = utilities.formatNumber(result);
            this.expression = this.current.toString();
            this.clearFlag = true;

        } catch (err) {
            console.log(err);
            this.current = "Error in calc";
            this.expression = "";
        }
    }
    
    clear() {
        this.expression = "";
        this.current = "0";
    }
    
    delete() {
        this.expression = this.expression.slice(0, -1);
        this.current = this.expression || "0";
    }

    toggleSign() {
        this.current = (parseFloat(this.current) * -1).toString();
    }
    
    reciprocal() {
        this.current = this.current !== "0" ? utilities.formatNumber(1 / this.current) : "0";
    }
    factorial() {
        this.expression += "!";
        this.current = this.expression;
    }

    scientific(op) {
        if (op === "pi" || op === "e") {
            this.expression += op;
        } else {
            this.expression += `${op}(`;
        }
        this.current = this.expression;
    }
    // calculate() {
    //     if (!this.operator || !this.previous) return;
    //     const curr = parseFloat(this.current);
    //     // const prev = parseFloat(this.previous);
    //     console.log("curr",curr,"prev",this.previous);
    //     const op = this.operator;
    //     let result;
    //     try {
    //         switch (op) {
    //             case "+":
    //                 result = this.add(this.previous, curr);
    //                 break;

    //             case "-":
    //                 result = this.subtract(this.previous, curr);
    //                 break;

    //             case "*":
    //                 result = this.multiply(this.previous, curr);
    //                 break;

    //             case "/":
    //                 result = this.divide(this.previous, curr);
    //                 break;

    //             case "%":
    //                 result = this.mod(this.previous, curr);
    //                 break;

    //             case "^":
    //                 result = this.power(this.previous, curr);
    //                 break;
    //         }
    //     } catch (err) {
    //         this.current = "error";
    //         this.operator = null;
    //         this.previous = null;
    //         return 0;
    //     }
    //     history.add(`${this.previous}${this.operator}${this.current}=${result}`);
    //     console.log("result ", result)
    //     this.current = utilities.formatNumber(result);
    //     this.operator = null;
    //     this.previous = null;
    //     this.clearFlag = true;
    // }
    // scientific(op) {
    //     const curr = parseFloat(this.current);
    //     console.log(curr)
    //     let result;
    //     try {
        //         switch (op) {
    //             case "sin": result = Math.sin(curr);
    //                 break;
    //             case "cos": result = Math.cos(curr);
    //                 break;
    //             case "tan": result = Math.tan(curr);
    //                 break;
    //             case "log": result = Math.log10(curr);
    //                 break;
    //             case "ln": result = Math.log(curr);
    //                 break;
    //             case "sqrt": result = Math.sqrt(curr);
    //                 break;
    //             case "pi": result = Math.PI;
    //                 break;
    //             case "e": result = Math.E;
    //                 break;
    //             // case "power": this.operator = "^";
    //             //     break;

    //         }
    //     } catch {
    //         result = NaN;
    //     }
    //     console.log(result);
    //     ["pi","e"].includes(op) ?history.add(`${op}`) :
    //     history.add(`${op} (${curr})`);
    //     // if(isNaN(result))this.current="Error22!";
    //     // else this.current=utilities.formatNumber(result);
    //     this.current = (!Number.isFinite(result))
    //     ? "Error!!!"
    //     :utilities.formatNumber(result);
    // }

    * tokenizer(exp) {
        const isNumber = (c) => {
            return ((c >= '0' && c <= '9') || c === ".");
        }
        const isAlphabat = (c) => {
            return ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z"));
        }

        // let tokens =[];
        let i = 0;
        while (i < exp.length) {
            const char = exp[i];
            //space senitiy check
            if (char === " ") {
                i++;
                continue;
            }

            //number check 
            // let isNumber=((char >= '0' && char<='9') || char ===".");
            if (isNumber(exp[i])) {
                let number = char;
                i++;
                while (i < exp.length && isNumber(exp[i])) {
                    number += exp[i];
                    i++;
                }
                yield number;
                continue;
            }
            // let isAlphabat = ((char>="a" && char<="z")||(char>="A"&& char<="Z"));
            if (isAlphabat(exp[i])) {
                let word = exp[i];
                i++;
                while (i < exp.length && isAlphabat(exp[i])) {
                    word += exp[i];
                    i++;
                }
                yield word.toLowerCase();
                continue;
            }
            yield char;
            i++;

        }
    }

    infixToPostfix(tokenStream) {

        const output = [];
        const stack = [];
        let prev = null;

        const functions = new Set(["sin", "cos", "tan", "ln", "log", "sqrt"]);

        const precedence = {
            "+": 1,
            "-": 1,
            "*": 2,
            "/": 2,
            "%": 2,
            "^": 3,
            "NEG": 4
        };

        const associativity = {
            "+": "left",
            "-": "left",
            "*": "left",
            "/": "left",
            "%": "left",
            "^": "right",
            "NEG": "right"
        };

        for (const token of tokenStream) {

            /* numbers + constants */
            if (!isNaN(token) || token === "e" || token === "pi") {
                output.push(token);
                prev = token;
                continue;
            }

            /* function */
            if (functions.has(token)) {
                stack.push(token);
                prev = token;
                continue;
            }

            /* left paren */
            if (token === "(") {
                stack.push(token);
                prev = token;
                continue;
            }

            /* right paren */
            if (token === ")") {
                while (stack.length && stack.at(-1) !== "(") {
                    output.push(stack.pop());
                }
                stack.pop();

                if (stack.length && functions.has(stack.at(-1))) {
                    output.push(stack.pop());
                }

                prev = token;
                continue;
            }

            /* factorial postfix */
            if (token === "!") {
                output.push(token);
                prev = token;
                continue;
            }

            /* unary minus */
            if (token === "-") {
                const isUnary =
                    prev === null ||
                    ["(", "+", "-", "*", "/", "%", "^"].includes(prev) ||
                    functions.has(prev);

                if (isUnary) {
                    stack.push("NEG");
                    prev = token;
                    continue;
                }
            }

            /* operator with associativity */
            while (stack.length) {

                const top = stack.at(-1);
                if (!(top in precedence)) break;

                const higher =
                    precedence[top] > precedence[token];

                const equalLeft =
                    precedence[top] === precedence[token] &&
                    associativity[token] === "left";

                if (higher || equalLeft) {
                    output.push(stack.pop());
                } else break;
            }

            stack.push(token);
            prev = token;
        }

        while (stack.length) output.push(stack.pop());

        return output;
    }

    evaluatePostfix(postfix) {
        const stack = [];
        const unaryFuncs = {
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.tan,
            ln: Math.log,
            log: Math.log10,
            sqrt: Math.sqrt,
            NEG: (a) => -a
        }

        for (const token of postfix) {

            if (!isNaN(token)) {
                stack.push(parseFloat(token));
                continue;
            }
            if (token === "pi" || token === "e") {
                const constant = token.toUpperCase();
                stack.push(Math[constant]);
            }
            if (token === "!"){
                const a=stack.pop();
                let r=utilities.factorial(a);
                stack.push(r);
                continue;
            }; //handle later on
            let result;
            if (token in unaryFuncs) {

                const a = stack.pop();
                result = unaryFuncs[token](a);
                stack.push(result);

                continue;
            }
            const b = stack.pop();
            const a = stack.pop();
             try {
            switch (token) {
                case "+":
                    result = this.add(a, b);
                    break;

                case "-":
                    result = this.subtract(a, b);
                    break;

                case "*":
                    result = this.multiply(a, b);
                    break;

                case "/":
                    result = this.divide(a, b);
                    break;

                case "%":
                    result = this.mod(a, b);
                    break;

                case "^":
                    result = this.power(a, b);
                    break;
            }
        } catch (err) {
            this.current = "error in eval";
            return 0;
        }
            stack.push(result);

        }
        return stack.pop()
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const calc = new Calculator();

    const currentDisplay = document.getElementById("currentDisplay");
    const historyDisplay = document.getElementById("historyDisplay");
    const historyList = document.getElementById("historyList");
    const grid = document.querySelector(".button-grid");

    function updateDisplay() {
        currentDisplay.textContent = calc.current;
        historyDisplay.textContent =
            calc.previous !== null && calc.operator
                ? `${calc.previous} ${calc.operator}`
                : "";
        renderHistory();
    }

    function renderHistory() {
        const data = history.get();
        historyList.innerHTML = "";

        if (data.length === 0) {
            historyList.innerHTML =
                '<p class="empty-message">No calculations yet</p>';
            return;
        }

        data.forEach((item) => {
            const div = document.createElement("div");
            div.className = "history-item";
            div.textContent = item;
            historyList.appendChild(div);
        });
    }

    /* Event Delegation */
    grid.addEventListener("click", function (e) {
        const btn = e.target.closest("button");
        if (!btn) return;

        const number = btn.dataset.number;
        const operator = btn.dataset.operator;
        const func = btn.dataset.function;
        const action = btn.dataset.action;
        

        if (number) calc.inputNumber(number);
        else if (operator) calc.setOperator(operator);
        else if (func) calc.scientific(func);
        else if (action) handleAction(action);

        updateDisplay();
    });

    function handleAction(action) {
        switch (action) {
            case "clear":
                calc.clear();
                break;
            case "delete":
                calc.delete();
                break;
            case "toggleSign":
                calc.toggleSign();
                break;
            case "calculate":
                calc.calculate();
                break;
            case "reciprocal":
                calc.reciprocal();
                break;
            case "factorial":
                calc.factorial();
                break;
        }
    }

    /* Keyboard Support */
    document.addEventListener("keydown", function (e) {
        console.log("Pressed:", e.key);

        if (!isNaN(e.key)) calc.inputNumber(e.key);
        else if (["+", "-", "*", "/", "^","(", ")"].includes(e.key))
            calc.setOperator(e.key);
        else if (e.key === "Enter") calc.calculate();
        else if (e.key === "Backspace") calc.delete();
        else if (e.key.toLowerCase() === "c") calc.clear();

        updateDisplay();
    });

    /* Theme Toggle */
    const themeBtn = document.getElementById("themeBtn");
    themeBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });

    /* Clear History */
    document
        .getElementById("clearHistoryBtn")
        .addEventListener("click", function () {
            history.clear();
            renderHistory();
        });

    updateDisplay();
});
