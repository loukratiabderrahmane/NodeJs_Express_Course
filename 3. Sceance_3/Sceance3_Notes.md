# 📦 NPM – Notes de cours (Séance 3)

---

## ❓ What is NPM?

**NPM (Node Package Manager)** is a package manager for JavaScript.

- It provides thousands of reusable modules created by third‑party developers
- Official website: https://www.npmjs.com

---

## 📥 Install a Package

```bash
npm i <package-name>
```

### Install a specific version
```bash
npm i <package-name>@<version>
```

### Install all packages from package.json
If you clone a repository that already contains a `package.json` file, run:
```bash
npm install
```
This installs all required dependencies.

---

## 🛠️ Install Dev Dependencies

**Dev dependencies** are packages needed only during development, not in production.

Example:
```bash
npm i nodemon -D
```

They are stored under `devDependencies` in `package.json`.

---

## 🔄 Update a Package

```bash
npm update
```

This updates packages according to semantic versioning rules.

---

## 🗑️ Uninstall a Package

```bash
npm rm <package-name>
```

### Uninstall a dev dependency
```bash
npm rm <package-name> -D
```

Example:
```bash
npm rm nodemon -D
```

---

## 🔢 Semantic Versioning

NPM uses **semantic versioning**:

```
Major.Minor.Patch
```

### Symbols used in versions

- `^` (caret):
  - Allows **minor** and **patch** updates
  - Prevents major updates that may break the application

- `~` (tilde):
  - Allows **patch** updates only

Example:
```json
"express": "^4.18.2"
```
