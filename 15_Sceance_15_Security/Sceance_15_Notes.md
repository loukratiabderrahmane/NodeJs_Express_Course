# 📘 Sécurité HTTP avec Helmet & Rate Limiting — Séance 15

---

## 📌 1. Introduction

Cette séance couvre deux couches de sécurité essentielles pour toute API Express en production :

- **Helmet** — Sécuriser les headers HTTP
- **express-rate-limit** — Protéger contre les attaques par force brute

Ces deux outils sont **indispensables** avant tout déploiement.

---

## 🛡 2. Helmet — Sécuriser les Headers HTTP

### 2.1 C'est quoi Helmet ?

Helmet est un middleware qui configure automatiquement des **headers HTTP de sécurité**.

Sans Helmet, ton API expose des informations sensibles et est vulnérable à plusieurs types d'attaques.

### 2.2 Installation

```bash
npm install helmet
```

### 2.3 Utilisation de base

```js
const helmet = require('helmet')
app.use(helmet())
```

Une seule ligne active **15 protections** automatiquement.

### 2.4 Headers activés par Helmet

| Header | Rôle | Attaque bloquée |
|--------|------|-----------------|
| `X-Content-Type-Options` | Empêche le sniffing MIME | MIME confusion |
| `X-Frame-Options` | Bloque les iframes non autorisées | Clickjacking |
| `X-XSS-Protection` | Protection XSS anciens navigateurs | XSS |
| `Strict-Transport-Security` | Force HTTPS | Man-in-the-middle |
| `Content-Security-Policy` | Restreint les sources de contenu | XSS, injection |
| `Referrer-Policy` | Contrôle les infos de référent | Data leakage |
| `X-Powered-By` (supprimé) | Cache qu'on utilise Express | Fingerprinting |

### 2.5 Configuration avancée

```js
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
        }
    },
    crossOriginEmbedderPolicy: false,  // désactiver si nécessaire pour une API
}))
```

### 2.6 Placement dans server.js

Helmet doit être **le premier middleware** — avant CORS, avant les routes :

```js
const helmet = require('helmet')

app.use(helmet())          // 1er
app.use(logger)            // 2ème
app.use(cors(corsOptions)) // 3ème
// ... reste des middlewares
```

---

## ⏱ 3. express-rate-limit — Limiter les Requêtes

### 3.1 C'est quoi le Rate Limiting ?

Le rate limiting limite le nombre de requêtes qu'un client peut faire dans un intervalle de temps donné.

**Sans rate limiting :**
- Un attaquant peut tester 100 000 mots de passe en quelques minutes
- Ton serveur peut être saturé par un flood de requêtes (DoS)

### 3.2 Installation

```bash
npm install express-rate-limit
```

### 3.3 Configuration de base

```js
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // 100 requêtes par fenêtre
    message: {
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,      // envoie les headers RateLimit-*
    legacyHeaders: false,
})

app.use(limiter)  // appliqué à toutes les routes
```

### 3.4 Limiteur spécifique par route

Il est recommandé d'avoir des limites **différentes selon la sensibilité** de la route :

```js
// Routes d'authentification — limite stricte
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many login attempts, try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
})

// Routes API générales — limite plus souple
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests.' },
    standardHeaders: true,
    legacyHeaders: false,
})

// Application
app.use('/auth', authLimiter)
app.use('/register', authLimiter)
app.use('/employees', apiLimiter)
```

### 3.5 Headers retournés par le rate limiter

Quand `standardHeaders: true`, le client reçoit :

```
RateLimit-Limit: 10
RateLimit-Remaining: 7
RateLimit-Reset: 1672531200
```

Utile pour que le frontend gère correctement les erreurs.

### 3.6 Code HTTP retourné

Par défaut : **429 Too Many Requests**

```js
const limiter = rateLimit({
    // ...
    statusCode: 429,  // valeur par défaut
})
```

---

## 🔐 4. Corriger le Cookie JWT

### 4.1 Le bug des séances précédentes

Dans les séances 11-14, le cookie JWT avait une faute :

```js
// ❌ FAUX — httponly en minuscule est ignoré
res.cookie('jwt', refreshToken, { httponly: true })

// ✅ CORRECT
res.cookie('jwt', refreshToken, { httpOnly: true })
```

### 4.2 Configuration complète et correcte

```js
res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000
})
```

| Option | Valeur | Rôle |
|--------|--------|------|
| `httpOnly` | `true` | Inaccessible via JavaScript (protection XSS) |
| `secure` | `true` en production | Transmis uniquement via HTTPS |
| `sameSite` | `'Strict'` | Protection CSRF |
| `maxAge` | `86400000` | Durée de vie : 1 jour |

---

## 🚨 5. Corriger l'Error Handler

### 5.1 Le problème des séances précédentes

```js
// ❌ DANGEREUX — expose les détails internes en production
res.status(500).send(err.message)
```

Un attaquant peut voir les noms de tables, les requêtes SQL, la structure interne.

### 5.2 Error Handler sécurisé

```js
const { logEvents } = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}`, 'errLog.txt')
    console.error(err.stack)

    const status = err.status || 500
    const isProd = process.env.NODE_ENV === 'production'

    res.status(status).json({
        message: isProd ? 'Internal Server Error' : err.message,
        ...(isProd ? {} : { stack: err.stack })
    })
}

module.exports = { errorHandler }
```

---

## 📁 6. Structure du projet séance 15

```
15_Sceance_15_Security/
├── config/
│   ├── corsOptions.js
│   ├── db.js
│   ├── roles_list.js
│   └── rateLimitConfig.js     ← NOUVEAU
├── middleware/
│   ├── errorHandler.js        ← CORRIGÉ
│   ├── logEvents.js
│   ├── verifyJWT.js
│   └── verifyRoles.js
├── .env.example               ← NOUVEAU
└── server.js                  ← MODIFIÉ
```

---

## ✅ 7. Checklist séance 15

- ✅ Installer helmet
- ✅ Installer express-rate-limit
- ✅ Helmet en premier middleware dans server.js
- ✅ authLimiter sur /auth et /register (max 10)
- ✅ apiLimiter sur /employees (max 100)
- ✅ Cookie JWT avec httpOnly, secure, sameSite corrects
- ✅ Error handler sécurisé (pas d'exposition en production)
- ✅ Fichier .env.example créé

---

## 🎯 8. Résumé

| Outil | Protection | Priorité |
|-------|------------|----------|
| Helmet | Headers HTTP, XSS, Clickjacking | Critique |
| Rate Limiting /auth | Brute force mots de passe | Critique |
| Rate Limiting /api | Déni de service | Important |
| Cookie sécurisé | Vol de token, CSRF | Critique |
| Error Handler | Data leakage | Important |

---

## 🔗 9. Ordre recommandé dans server.js

```js
// 1. Helmet (sécurité headers)
app.use(helmet())

// 2. Logger
app.use(logger)

// 3. CORS
app.use(cors(corsOptions))

// 4. Body parsers
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 5. Cookies
app.use(cookieParser())

// 6. Fichiers statiques
app.use('/', express.static(path.join(__dirname, '/public')))

// 7. Routes publiques avec rate limiting
app.use('/register', authLimiter, require('./routes/register'))
app.use('/auth', authLimiter, require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/lougout'))

// 8. Routes protégées
app.use(verifyJWT)
app.use('/employees', apiLimiter, require('./routes/api/employees'))

// 9. 404 handler
// 10. Error handler (toujours en dernier)
app.use(errorHandler)
```
