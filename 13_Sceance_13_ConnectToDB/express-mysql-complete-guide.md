# 📘 Connexion MySQL avec Express.js ---Sceance 13

---

# 📌 1. Introduction

Cette documentation explique en détail comment connecter une application
**Express.js** à une base de données **MySQL**, avec toutes les notions
importantes :

- Installation
- Configuration
- createConnection vs createPool
- async/await et promise()
- CRUD
- Sécurité (SQL Injection)
- Utilisation de .env
- Gestion des erreurs
- Bonnes pratiques production

---

# 🏗 2. Architecture Générale

Client → Express API → mysql2 → MySQL Server

⚠️ MySQL Workbench est seulement une interface graphique.\
Express se connecte directement au serveur MySQL.

---

# ⚙️ 3. Installation

```bash
npm install mysql2 dotenv
```

---

# 🗄 4. Création de la Base de Données

```sql
CREATE DATABASE company_db;
USE company_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  refresh_token TEXT
);
```

---

# 🔌 5. Connexion à MySQL (config/db.js)

```js
require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
```

---

# 🔍 6. createConnection vs createPool

| createConnection          | createPool               |
| ------------------------- | ------------------------ |
| Une seule connexion       | Plusieurs connexions     |
| Peu scalable              | Scalable                 |
| Déconseillé en production | Recommandé en production |

---

# ⏳ 7. Pourquoi .promise() ?

Sans `.promise()` → callbacks\
Avec `.promise()` → async/await

```js
const [rows] = await pool.query("SELECT * FROM users");
```

---

# 🧠 8. Comment fonctionne pool ?

Le pool garde plusieurs connexions ouvertes et les réutilise pour éviter
de recréer une connexion à chaque requête.

---

# 🔐 9. Sécurité --- SQL Injection

Toujours utiliser les placeholders `?` :

```js
await db.query("SELECT * FROM users WHERE username = ?", [username]);
```

Ne jamais concaténer les variables directement dans la requête.

---

# 📦 10. Exemple CRUD

## 🔹 GET

```js
const [rows] = await db.query("SELECT * FROM users");
```

## 🔹 INSERT

```js
const [result] = await db.query(
  "INSERT INTO users (username, password) VALUES (?, ?)",
  [username, hashedPassword],
);
console.log(result.insertId);
```

## 🔹 UPDATE

```js
await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
  refreshToken,
  userId,
]);
```

## 🔹 DELETE

```js
await db.query("DELETE FROM users WHERE id = ?", [userId]);
```

---

# 🌍 11. Utilisation de .env

.env

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=company_db

Ne jamais push .env sur GitHub.

---

# 🚨 12. Erreurs Fréquentes

| Erreur                 | Cause                      |
| ---------------------- | -------------------------- |
| ECONNREFUSED           | MySQL non démarré          |
| ER_ACCESS_DENIED_ERROR | Mauvais mot de passe       |
| ER_BAD_DB_ERROR        | Base inexistante           |
| Too many connections   | connectionLimit trop élevé |

---

# ⚡ 13. Bonnes Pratiques Production

- Utiliser createPool()
- Utiliser .promise()
- Mettre connectionLimit entre 10 et 20
- Utiliser .env
- Toujours valider les entrées utilisateur
- Gérer les erreurs avec try/catch

---

# 🏆 14. Résumé Final

Pour connecter Express à MySQL proprement :

1.  Installer mysql2
2.  Créer la base et les tables
3.  Configurer createPool()
4.  Utiliser async/await
5.  Sécuriser les requêtes
6.  Utiliser .env
7.  Gérer les erreurs

---

# 🎯 Conclusion

Cette architecture permet de construire une API Express sécurisée,
scalable et prête pour la production.
