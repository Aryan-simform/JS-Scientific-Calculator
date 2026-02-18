"use strict";
// toggle Theme on click of theme-btn using body.classlist.toggle
const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

const state = {
    curr: "0", //sufix operand
    prev: null, //prefix operand
    op: null, // stores the current operation to be performed
    clr: false, // flag to decide if to clear #current-display or not.
};
//function to calculate factorial
const fact = function (x) {
    if (isNaN(x)) return "ERROR: wrong input detected!";
    let i = 1n;
    let res = 1n;
    while (i != x) {
        res = i * res;
        i++;
    }
    return res;
};
//actions are clear delete toggle and calc
const actions = {
    clear: () => {
        state.curr = "0";
        state.prev = null;
        state.op = null;
        state.clr = false;
    },
    delete: () => {
        if (!state.curr) return;
        state.curr = state.curr.slice(0, -1) || "0";
    },
    toggleSign: () => (state.curr = -1*parseFloat(state.curr)), // invert signs
    calculate: calc,
    factorial:fact,
    reciprocal:(x)=>1/x
};

const ops = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => (y !== 0 ? x / y : "ERROR: can't divide by 0!"),
    "%": (x, y) => x % y,
    "^": (x, y) => Math.pow(x, y),
};

const sciOps = {
    sin: (x) => Math.sin(x),
    cos: (x) => Math.cos(x),
    tan: (x) => Math.tan(x),
    exp: (x) => Math.exp(x),
    log: (x) => Math.log10(x),
    ln: (x) => Math.log(x),
    pi: () => Math.PI,
    reci: (x) => 1 / x,
    sqrt: (x) => Math.sqrt(x),
    fact: (x) => fact(x),
};



function handleNumber(num) {
    if (state.clr) {
        state.curr = num;
        state.clr = false;
    } else {
        state.curr = state.curr === "0" ? num : state.curr + num;
    }
}

function handleOperator(op) {
    if (state.prev !== null) calc();
    state.op = op;
    state.prev = state.curr;
    state.clr = true;
}

function handleFunction(funcName) {
    const value = parseFloat(state.curr);
    const result = sciOps[funcName](value);
    state.curr = String(result);
}

function calc() {
    if (!state.op || state.prev === null) return;

    const a = parseFloat(state.prev);
    const b = parseFloat(state.curr);
    const result = ops[state.op](a, b);

    state.curr = String(result);
    state.prev = null;
    state.op = null;
}

function updateDisplay() {
    document.getElementById("currentDisplay").textContent = state.curr;
}

const btngrid = document.querySelector(".button-grid");
console.log(btngrid);

btngrid.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;
    console.log(btn);

    if (btn.dataset.number) handleNumber(btn.dataset.number);
    else if (btn.dataset.operator) handleOperator(btn.dataset.operator);
    else if (btn.dataset.function) handleFunction(btn.dataset.function);
    else if (btn.dataset.action){
            const action =actions[btn.dataset.action];
            action();
        }
    updateDisplay();
});
