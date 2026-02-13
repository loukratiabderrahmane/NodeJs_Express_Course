# 📘 Middlewares dans Express.js — Sceance 7



## 0) C’est quoi un middleware ?

Un **middleware** est une fonction qui s’exécute **entre** la requête du client et la réponse du serveur.

### ✅ Signature classique
```js
(req, res, next) => {
  // traitement
  next(); // passe au prochain middleware/route
}
```

### 🔥 À retenir
- `req` : infos de la requête (URL, headers, body…)
- `res` : ce que tu vas renvoyer
- `next()` : **obligatoire** si tu veux continuer le “flow”
- Si tu oublies `next()` (et tu n’envoies pas de réponse), la requête reste **bloquée**.

---

## 1) Le flow (cycle requête → réponse) dans Express

L’ordre du code est **très important**. Express exécute les choses dans l’ordre où tu les écris.

### 🧠 Schéma simple
```
Client
  ↓
Middleware 1
  ↓ next()
Middleware 2
  ↓ next()
Route (app.get/app.post…)
  ↓ res.send/res.json…
Réponse
```

### ✅ Règle d’or
- `next()` → continue vers le prochain middleware/route
- `res.send()` / `res.json()` / `res.sendFile()` → **termine** la requête (on répond au client)

---

## 2) `app.use(express.urlencoded({ extended: false }))`

### ✅ À quoi ça sert ?
Ce middleware permet à Express de **lire les données envoyées par un formulaire HTML** (format `x-www-form-urlencoded`).

Exemple (formulaire HTML) :
```html
<form method="POST" action="/login">
  <input name="username" />
  <input name="password" />
  <button>Send</button>
</form>
```

Sans ce middleware, `req.body` sera souvent `undefined` quand tu postes un formulaire.

### ✅ Exemple
```js
app.use(express.urlencoded({ extended: false }));

app.post('/login', (req, res) => {
  console.log(req.body); // { username: '...', password: '...' }
  res.send('OK');
});
```

### ⚙️ `extended: false` vs `true`
- `false` : parsing simple (données plates)
- `true` : support des objets imbriqués (plus puissant)

**Dans la plupart des projets débutants** : `false` suffit très bien.

---

## 3) `app.use(express.json())`

### ✅ À quoi ça sert ?
Ce middleware permet à Express de lire le **JSON** envoyé dans une requête (API REST).

Exemple de requête envoyée par un frontend (ou Postman) :
```json
{
  "email": "test@gmail.com",
  "password": "1234"
}
```

### ✅ Exemple
```js
app.use(express.json());

app.post('/api/login', (req, res) => {
  console.log(req.body); // { email: 'test@gmail.com', password: '1234' }
  res.json({ message: 'Login reçu' });
});
```

### 🔥 À retenir
- `express.json()` = pour les APIs / JSON
- `express.urlencoded()` = pour les formulaires HTML

Beaucoup de projets utilisent les **deux**.

---

## 4) `app.use(express.static(path.join(__dirname, 'public')))`  

### ✅ À quoi ça sert ?
Servir les **fichiers statiques** : CSS, images, JS frontend, fonts…

### 📁 Exemple de structure
```
project/
  server.js
  public/
    css/style.css
    js/app.js
    images/logo.png
  views/
    index.html
```

### ✅ Exemple d’utilisation dans HTML
```html
<link rel="stylesheet" href="/css/style.css" />
<script src="/js/app.js"></script>
<img src="/images/logo.png" />
```

**Pourquoi ça marche ?**  
Parce que Express va chercher automatiquement dans `public/` (sans que tu écrives `/public` dans l’URL).

---

## 5) Middleware personnalisé (custom middleware)

### ✅ Exemple 1 : Logger simple
```js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);
```

👉 À chaque requête, ça affiche par exemple :
```
GET /profile
POST /login
```

### ✅ Exemple 2 : Ajouter une info dans `req`
```js
const addTime = (req, res, next) => {
  req.time = new Date().toISOString();
  next();
};

app.use(addTime);

app.get('/', (req, res) => {
  res.send(`Time: ${req.time}`);
});
```

### 🔥 À retenir
- Un middleware peut **lire** `req`, **modifier** `req`, **bloquer** la requête (en répondant) ou **laisser passer** via `next()`.

---

## 6) CORS : `app.use(cors())`

### ✅ C’est quoi CORS ?
CORS = règle de sécurité du navigateur.

Si ton frontend est sur :
- `http://localhost:3000`
et ton backend sur :
- `http://localhost:3500`

Le navigateur peut bloquer les appels API sans autorisation.

### ✅ Solution simple (dev)
```js
const cors = require('cors');
app.use(cors());
```

👉 Autorise toutes les origines (pratique en dev, moins conseillé en prod).

---

## 7) CORS avec whitelist (pro) + explication de `callback(null, true)`

### ✅ Code
```js
const whitelist = [
  'https://www.monsite.com',
  'http://127.0.0.1:5500',
  'http://localhost:3500'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 🧠 Explication claire
- `origin` = l’adresse du site qui fait la requête (ex: `http://127.0.0.1:5500`)
- `whitelist` = liste des sites autorisés
- `indexOf(origin) !== -1` signifie : **origin existe dans la whitelist**

#### ✅ `callback(null, true)` veut dire :
- `null` : aucune erreur
- `true` : autoriser la requête

👉 Traduction : “OK, laisse passer”.

#### ❌ `callback(new Error(...))` veut dire :
👉 “Refuse cette origine”.

### ⚠️ Remarque importante (Postman / curl)
Parfois `origin` peut être `undefined` (Postman, curl, serveur→serveur).  
Version plus robuste :
```js
if (!origin || whitelist.includes(origin)) {
  callback(null, true);
} else {
  callback(new Error('Not allowed by CORS'));
}
```

### ✅ `optionSuccessStatus: 200`
Certaines requêtes CORS font un “preflight” `OPTIONS`.  
Cette option force un statut **200** (compatibilité).

---

## 8) Middleware d’erreurs (Error Handler) + logging

### ✅ Ton code
```js
const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
  console.error(err.stack);
  res.status(500).send(err.message);
};

module.exports = { errorHandler };
```

### 🧠 Explication
- `err` : l’erreur capturée
- `logEvents(...)` : écrit l’erreur dans un fichier `errLog.txt`
- `console.error(err.stack)` : affiche la trace (utile pour debug)
- `res.status(500)` : réponse “Internal Server Error”
- `send(err.message)` : envoie le message au client

### 🔥 TRÈS IMPORTANT
Un error middleware doit avoir **4 paramètres** :
```js
(err, req, res, next)
```
Sinon Express ne le reconnaît pas comme “error handler”.

### ✅ Placement (toujours à la fin)
```js
app.use(errorHandler);
```

---

## 9) Handler 404 avec `app.all(/.*/ ...)`

### ✅ Ton code
```js
app.all(/.*/, (req, res) => {
  res.status(404);

  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});
```

### 🧠 Explication
- `app.all()` : capture **toutes les méthodes** (GET, POST, PUT, DELETE…)
- `/.*/` : regex qui correspond à **toutes les URLs**
- Donc ce handler marche comme : “si aucune route n’a matché avant → 404”.

### 🧩 Pourquoi `req.accepts()` ?
Le navigateur/API n’attend pas la même réponse :
- navigateur → HTML (une page 404)
- API / Postman → JSON
- scripts → texte

### ✅ Placement
Ce handler 404 doit être **après toutes tes routes** et **avant** `errorHandler`.

---

## 10) Ordre recommandé dans un projet Express

```js
// 1) Middlewares “généraux”
app.use(cors(corsOptions));           // ou cors()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 2) Routes
app.use('/', require('./routes/root'));
app.use('/api/users', require('./routes/users'));

// 3) 404 handler
app.all(/.*/, (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// 4) Error handler (dernier)
app.use(errorHandler);
```

---

## ✅ Résumé final

- Middleware = fonction entre requête et réponse
- `express.json()` = lire JSON (API)
- `express.urlencoded()` = lire formulaires HTML
- `express.static()` = servir CSS/images/JS
- `cors()` = autoriser les appels cross-origin
- whitelist CORS = sécurité (autoriser seulement certains sites)
- `app.all(/.*/)` = handler 404
- `errorHandler(err, req, res, next)` = gestion d’erreurs (toujours à la fin)

