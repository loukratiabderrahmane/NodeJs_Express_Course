# 📘 Créer un serveur Express basique  — Sceance 6


## 1️⃣ Qu’est-ce qu’Express.js ?

**Express.js** est un framework backend pour Node.js qui permet de :
- créer un serveur web rapidement
- gérer les routes (`GET`, `POST`, etc.)
- structurer une API proprement

👉 Express simplifie énormément le module `http` de Node.js.

---

## 2️⃣ Pré-requis

- Node.js installé
- npm installé

Vérification :
```bash
node -v
npm -v
```

---

## 3️⃣ Initialiser un projet Express

### 📁 Créer un dossier
```bash
mkdir my-express-server
cd my-express-server
```

### 📦 Initialiser npm
```bash
npm init -y
```

### 📥 Installer Express
```bash
npm install express
```

---

## 4️⃣ Créer un serveur Express basique

### 📄 Fichier `server.js`

```js
const express = require('express');
const app = express();
const PORT = 3500;
```

### 🧠 Explication
- `express()` crée l’application serveur
- `app` représente ton serveur
- `PORT` est le port d’écoute

---

## 5️⃣ Créer une première route

```js
app.get('/', (req, res) => {
  res.send('Hello Express 👋');
});
```

### 🧠 Explication
- `app.get()` → route HTTP GET
- `'/'` → URL demandée
- `req` → requête
- `res` → réponse envoyée au client

---

## 6️⃣ Lancer le serveur

```js
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
```

### ▶️ Lancer
```bash
node server.js
```

➡️ Ouvre :
```
http://localhost:3500
```

---

## 7️⃣ Routes multiples (sans Regex)

```js
app.get('/about', (req, res) => {
  res.send('Page About');
});

app.get('/contact', (req, res) => {
  res.send('Page Contact');
});
```

👉 Chaque URL correspond à **une route précise**.

---

## 8️⃣ Pourquoi utiliser des Regex dans Express ?

Les **Regex (expressions régulières)** permettent de :
- capturer plusieurs URLs avec **une seule route**
- éviter la répétition
- rendre le code plus propre et flexible

---

## 9️⃣ Route avec Regex – Exemple simple

```js
app.get(/^\/$|\/index(.html)?/, (req, res) => {
  res.send('Page Home');
});
```

### 🧠 Ce que ça accepte :
- `/`
- `/index`
- `/index.html`

---

## 🔍 Décomposition du Regex

```regex
^\/$ | \/index(.html)?
```

| Partie | Rôle |
|------|------|
| `^` | début de la chaîne |
| `\/` | slash `/` |
| `$` | fin de la chaîne |
| `|` | OU |
| `(.html)?` | `.html` optionnel |

---

## 1️⃣0️⃣ Regex sans `^` et `$`

```js
app.get(/about(.html)?/, (req, res) => {
  res.send('About page');
});
```

### ✅ Correspond à :
- `/about`
- `/about.html`

👉 Express vérifie déjà l’URL complète, donc parfois `^` et `$` ne sont pas nécessaires.

---

## 1️⃣1️⃣ Redirection avec Regex

```js
app.get(/old-page(.html)?/, (req, res) => {
  res.redirect(301, '/new-page.html');
});
```

### 🧠 Rôle
- `301` = redirection permanente
- utile pour le SEO
- anciennes URLs → nouvelles URLs

---

## 1️⃣2️⃣ Regex vs routes classiques

### ❌ Sans Regex
```js
app.get('/', ...)
app.get('/index', ...)
app.get('/index.html', ...)
```

### ✅ Avec Regex
```js
app.get(/^\/$|\/index(.html)?/, ...)
```

👉 Moins de code, plus propre.

---

## 1️⃣3️⃣ Quand utiliser les Regex ?

✅ Bon cas :
- pages `index`
- anciennes URLs
- `.html` optionnel
- SEO

❌ Mauvais cas :
- routes simples
- APIs REST (préférer routes claires)

---

## 1️⃣4️⃣ Exemple complet de serveur Express basique

```js
const express = require('express');
const app = express();
const PORT = 3500;

app.get(/^\/$|\/index(.html)?/, (req, res) => {
  res.send('Home');
});

app.get(/about(.html)?/, (req, res) => {
  res.send('About');
});

app.get(/contact(.html)?/, (req, res) => {
  res.send('Contact');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## ✅ Résumé final

- Express facilite la création de serveurs Node.js
- `app.get()` définit une route
- `req` = requête, `res` = réponse
- Les Regex permettent de gérer plusieurs URLs avec une seule route
- Très utiles pour SEO et compatibilité

---

📌 Prochaine étape logique :
➡️ comprendre les **middlewares**
