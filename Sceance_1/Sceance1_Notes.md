# 📦 JavaScript Modules – Notes de cours (Séance 1)

---

## What is a module in JavaScript?

A **module** is a **file** that contains code (variables, functions, classes)
that can be **reused** in other files.

👉 **Module = a file that exports code and can be imported elsewhere**

---

## Why use modules?

Modules help to:
- organize code
- avoid very large files
- reuse code
- avoid name conflicts
- make projects easier to maintain

---

## Types of modules in JavaScript

There are **two main module systems**:

1. **CommonJS** (mainly used in Node.js)
2. **ES Modules (ESM)** (modern JavaScript)

---

## 1) CommonJS Modules (Node.js)

### Export a module
```js
// math.js
function add(a, b) {
  return a + b;
}

module.exports = add;
```

### Import a module
```js
// app.js
const add = require('./math');

console.log(add(2, 3));
```

### Export multiple values
```js
module.exports = {
  add,
  sub
};
```

```js
const { add, sub } = require('./math');
```

---

## 2) ES Modules (Modern JavaScript)

### Named export
```js
// math.js
export function add(a, b) {
  return a + b;
}
```

### Import
```js
import { add } from './math.js';
```

### Default export
```js
export default function add(a, b) {
  return a + b;
}
```

```js
import add from './math.js';
```

⚠️ In Node.js, to use ES Modules:
- use `.mjs`
- or add `"type": "module"` in `package.json`

---

## Built-in modules in Node.js

Node.js provides built-in modules (no installation needed):

- `fs` – file system
- `path` – file paths
- `http` – servers
- `events` – events
- `os` – system info

Example:
```js
const fs = require('fs');
```

---

## Third-party modules (NPM)

Installed from NPM:
```bash
npm install express
```

```js
const express = require('express');
```

---

## Local modules

Modules you create yourself:
```js
const myModule = require('./myModule');
```

`./` means current directory.

---

## Summary

- A module is a reusable file
- Node.js uses CommonJS by default
- ES Modules are the modern standard
- Modules can be:
  - built-in
  - local
  - third-party

---

## Key sentence to remember

> A JavaScript module is a file that encapsulates code and exposes it using exports so it can be reused via imports.
