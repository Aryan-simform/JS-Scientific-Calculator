# JavaScript Scientific Calculator Expression Based

A Responsive and functional Scientific Calculator built using HTLM,CSS,JS 

---

## ✨ Features

### Basic Operations

* Addition `+`
* Subtraction `-`
* Multiplication `*`
* Division `/`
* Modulus `%`
* Power `^`
* Parentheses support `( )`

### Scientific Functions

* `sin(x)`
* `cos(x)`
* `tan(x)`
* `log(x)` (base-10)
* `ln(x)` (natural log)
* `sqrt(x)`
* Factorial `!`
* Constants `π` and `e`

### Extra Functionality

* Expression evaluation with correct precedence
* Unary minus handling
* Keyboard input support
* Calculation history
* Dark / light theme toggle
* Persistent history using **localStorage**

---

## Core Concepts Used

### 1. Closures

Used for encapsulating private state:

* `utilities` module
* `createHistory()` for history persistence

This keeps internal variables private while exposing a public API.

---

### 2. Prototype

Basic arithmetic operations are implemented using prototype methods:

* add
* subtract
* multiply
* divide
* mod
* power

---

### 3. Classes

The `Calculator` class encapsulates and implements arithmetic operations :

* Expression state
* UI interaction
* Parsing pipeline
* Evaluation logic

---

### 4. this Keyword

Used across:

* Class methods
* Prototype methods
* Event handlers

---

### 5. Modularity

Code is split into logical modules:

* Utilities (formatting, factorial)
* History manager
* Tokenizer
* Parser (infix → postfix)
* Evaluator
* UI controller

---

### 6. Generators

The tokenizer is implemented using a **generator function**:

* Produces tokens lazily
* Enables streaming parsing

---

### 7. Expression Parsing Algorithm

Uses **Shunting Yard Algorithm** concepts:

* Operator precedence
* Associativity
* Function handling
* Unary operator detection

Pipeline:

```
Expression
 → Tokenizer
 → Infix to Postfix
 → Postfix Evaluation
 → Result
```

---

### 8. Error Handling

Handles:

* Division by zero
* Invalid factorial
* NaN results

---

## How to Run

### Option 1 — Open Locally

1. Clone or download the project
2. Open the HTML file in a browser

That’s it.

---

### Option 2 — Using VS Code Live Server

1. Install Live Server extension
2. Right click HTML file
3. Click **Open with Live Server**

---

## Keyboard Support

| Key       | Action       |
| --------- | ------------ |
| Numbers   | Input number |
| + - * / ^ | Operators    |
| ( )       | Parentheses  |
| Enter     | Calculate    |
| Backspace | Delete       |
| C         | Clear        |

---

## Example Expressions

```
sin(30)
sqrt(16)+2^3
5!+ln(e)
(2+3)*4
-3^2
```

---

## Known Limitations (Future Work)

* Implicit multiplication (`2sin(30)`, `2π`)
* Degree / radian toggle
* Precision rounding strategy
* Expression validation UI
* Memory functions
* AST based evaluator

---

## 🛠 Tech Stack

* HTML
* CSS
* JavaScript (ES6+)

No external libraries used.

---
## Screenshots

![white Theme](./images/Screenshot%20white%20theme.png)
![Dark Theme](./images/Screenshot%20dark%20theme.png)
![With Scientific Expressions](./images/white%20theme%20sci%20func.png)