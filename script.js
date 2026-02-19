const utilities = (function () {
    function formatNumber(number) {
        if (!Number.isFinite(number)) return "Error!";
        console.log(number);
        return (parseFloat(number));
    }

    function factorial(number) {
        if (!Number.isInteger(number)|| parseFloat(number)<0) return "Error! Number must be integer";
        let res = BigInt(1);
        let i =BigInt(2);
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

            hist=[];
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
        this.current = "0";
        this.previous = null;
        this.operator = null;
        this.clearFlag = false;
    }
    //set the current number and reset the clearFlag
    inputNumber(number) {
        if (this.clearFlag) {
            this.current = number;
            this.clearFlag = false;
            return;
        }
        if (number === "." && this.current.includes(".")) return;

        this.current = this.current === "0" ? number : this.current + number;
    }

    setOperator(op) {
        if (this.operator) this.calculate();
        this.previous = parseFloat(this.current);
        this.operator = op;
        this.clearFlag = true;
    }

    calculate() {
        if (!this.operator || !this.previous) return;
        const curr = parseFloat(this.current);
        // const prev = parseFloat(this.previous);
        console.log("curr",curr,"prev",this.previous);
        const op = this.operator;
        let result;
        try {
            switch (op) {
                case "+":
                    result = this.add(this.previous, curr);
                    break;

                case "-":
                    result = this.subtract(this.previous, curr);
                    break;

                case "*":
                    result = this.multiply(this.previous, curr);
                    break;

                case "/":
                    result = this.divide(this.previous, curr);
                    break;

                case "%":
                    result = this.mod(this.previous, curr);
                    break;

                case "^":
                    result = this.power(this.previous, curr);
                    break;
            }
        } catch (err) {
            this.current = "error";
            this.operator = null;
            this.previous = null;
            return 0;
        }
        history.add(`${this.previous}${this.operator}${this.current}=${result}`);
        console.log("result ", result)
        this.current = utilities.formatNumber(result);
        this.operator = null;
        this.previous = null;
        this.clearFlag = true;
    }

    clear() {
        this.current = "0";
        this.operator = null;
        this.previous = null;
    }

    delete() {

        if (this.current) this.current = this.current.length > 1 ? this.current.slice(0, -1) : "0";
    }

    toggleSign() {
        this.current = (parseFloat(this.current) * -1).toString();
    }

    reciprocal() {
        this.current = this.current !== "0" ? utilities.formatNumber(1 / this.current) : "0";
    }
    factorial() {
        this.current = utilities.factorial(parseFloat(this.current));
    }

    scientific(op) {
        const curr = parseFloat(this.current);
        console.log(curr)
        let result;
        try {
            switch (op) {
                case "sin": result = Math.sin(curr);
                    break;
                case "cos": result = Math.cos(curr);
                    break;
                case "tan": result = Math.tan(curr);
                    break;
                case "log": result = Math.log10(curr);
                    break;
                case "ln": result = Math.log(curr);
                    break;
                case "sqrt": result = Math.sqrt(curr);
                    break;
                case "pi": result = Math.PI;
                    break;
                case "e": result = Math.E;
                    break;
                // case "power": this.operator = "^";
                //     break;

            }
        } catch {
            result = NaN;
        }
        console.log(result);
        ["pi","e"].includes(op) ?history.add(`${op}`) :
        history.add(`${op} (${curr})`);
        // if(isNaN(result))this.current="Error22!";
        // else this.current=utilities.formatNumber(result);
        this.current = (!Number.isFinite(result))
        ? "Error!!!"
        :utilities.formatNumber(result);
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
        if (!isNaN(e.key)) calc.inputNumber(e.key);
        else if (["+", "-", "*", "/"].includes(e.key))
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
