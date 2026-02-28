# 📘 Sceance 14 --- Architecture MVC Approfondie avec MySQL

---

# 📌 1. Introduction

Cette sceance approfondit la **Sceance 13** en implémentant une architecture **MVC complète** avec :

- **Modèles (M)** - Logique métier et accès à la base de données
- **Contrôleurs (C)** - Gestion des requêtes HTTP
- **Gestion d'erreurs centralisée** - Middleware errorHandler
- **Authentification & Autorisation** - JWT + Refresh Tokens + Rôles
- **Transactions** - Garantir l'intégrité des données
- **Bonnes pratiques** - try-catch, next(err), séparation des responsabilités

---

# 🏗 2. Architecture Générale

```
Client (HTTP Request)
    ↓
Routes (routes/auth.js, routes/employees.js)
    ↓
Controllers (authController, employeesController, registerController)
    ↓
Models (authModel, usersModel, employeesModel)
    ↓
Database (MySQL)
    ↓
Error Handler Middleware (en cas d'erreur)
```

---

# 🗂 3. Structure des Fichiers

```
14_Sceance_14_ConnectToDB_DeepDive/
├── config/
│   ├── db.js               // Connexion MySQL
│   └── roles_list.js       // Énumération des rôles
├── controllers/
│   ├── authController.js   // Login + JWT
│   ├── registerController.js // Enregistrement
│   ├── employeesController.js // CRUD Employees
│   ├── refreshTokenController.js // Renouveller JWT
│   └── lougoutController.js // Logout
├── middleware/
│   ├── errorHandler.js     // Gestion des erreurs
│   ├── logEvents.js        // Logging
│   └── verifyJWT.js        // Vérifier token JWT
├── model/
│   ├── authModel.js        // Tokens & Refresh
│   ├── usersModel.js       // Utilisateurs
│   └── employeesModel.js   // Employés
└── server.js               // Point d'entrée
```

---

# 🔌 4. Connexion MySQL (config/db.js)

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

# 👥 5. Gestion des Rôles (config/roles_list.js)

```js
const ROLES_LIST = {
  Admin: 5150,
  Editor: 1984,
  User: 2001,
};

module.exports = ROLES_LIST;
```

**Avantages:**

- ✅ Lisibilité - `ROLES_LIST.Admin` au lieu de `5150`
- ✅ Maintenabilité - change une fois, partout mis à jour
- ✅ Sécurité - pas d'erreurs de typage

---

# 🧠 6. Architecture Modèle-Contrôleur

## 6.1 Modèle (usersModel.js)

Le modèle gère **TOUTE** la logique métier et l'accès BDD :

```js
// ✅ BON - Logique dans le modèle
const getUser = async (username) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE username = ? LIMIT 1",
    [username],
  );
  return rows[0];
};
```

## 6.2 Contrôleur (authController.js)

Le contrôleur gère **SEULEMENT** les requêtes HTTP :

```js
// ✅ BON - Contrôleur demande au modèle
const handleAuth = async (req, res, next) => {
  try {
    const UserFound = await usersModel.getUser(user);
    if (!UserFound) return res.status(404).json("User not Found !");
    // ...
  } catch (err) {
    next(err); // Passe l'erreur au middleware
  }
};
```

**Règle d'Or:** Pas de `db.query()` dans les contrôleurs! ❌

---

# 🔐 7. Trois Modèles Importants

### 7.1 usersModel.js

Gère les utilisateurs:

- `getUser(username)` - Récupérer par username
- `checkUserExists(username)` - Vérifier l'existence
- `createNewUser(username, password)` - Enregistrement avec transaction
- `getUserRole(id)` - Récupérer les rôles

### 7.2 authModel.js

Gère les tokens:

- `getUserByRefreshToken(token)` - Récupérer utilisateur par token
- `saveRefreshToken(token, userId)` - Sauvegarder le token
- `deleteRefreshToken(userId)` - Supprimer (logout)

### 7.3 employeesModel.js

Gère les employés (CRUD):

- `getEmployees()` - Tous les employés
- `getEmployee(id)` - Un employé
- `createEmployee(firstname, lastname)` - Créer
- `updateAnEmployee(fields, values)` - Mettre à jour
- `deleteAnEmployee(id)` - Supprimer
- `renitializeId()` - Réinitialiser AUTO_INCREMENT

---

# 🔄 8. Cycle de Vie d'une Requête avec Erreurs

```javascript
// 1️⃣ CONTRÔLEUR - Démarre
const handleAuth = async (req, res, next) => {
  try {
    // 2️⃣ MODÈLE - Traite la requête
    const UserFound = await usersModel.getUser(user);

    // 3️⃣ VALIDATION - Vérifie le résultat
    if (!UserFound) {
      return res.status(404).json("User not Found !"); // Répond directement
    }

    // 4️⃣ TRAITEMENT - Logique métier
    const match = await bcrypt.compare(pwd, UserFound.password);

    // 5️⃣ SUCCÈS - Envoie la réponse
    res.json({ accessToken });

    // 6️⃣ ERREUR - Attrape et passe au middleware
  } catch (err) {
    next(err); // ✅ Important!
  }
};

// 7️⃣ MIDDLEWARE d'erreur - Enregistre et répond
const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  res.status(500).send(err.message);
};
```

---

# ⚡ 9. Gestion des Erreurs Complète

### 9.1 Erreurs Métier (contrôleur)

```js
if (!user || !pwd) {
  return res.status(400).json({ message: "Missing data" });
}

if (!UserFound) {
  return res.status(404).json({ message: "User not found" });
}

if (!match) {
  return res.status(401).json({ message: "Invalid password" });
}
```

### 9.2 Erreurs Techniques (middleware)

```js
// Erreur non attendue → middleware
try {
  const result = await employeesModel.createEmployee(fname, lname);
} catch (err) {
  next(err); // Passe au middleware
}
```

### 9.3 Middleware d'erreur

```js
const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  res.status(500).json({ message: err.message });
};
```

---

# 🔐 10. Authentification & Autorisation

### 10.1 Flux Login

```
1. Client envoie username + password
2. authController cherche l'utilisateur (modèle)
3. Compare le mot de passe avec bcrypt
4. Crée 2 tokens: accessToken (court) + refreshToken (long)
5. Sauvegarde refreshToken en BDD (authModel)
6. Envoie accessToken au client (cookie pour refreshToken)
```

### 10.2 Flux Refresh Token

```
1. Client envoie refreshToken (du cookie)
2. refreshTokenController cherche l'utilisateur (authModel)
3. Vérifie la signature du token avec JWT
4. Génère un nouveau accessToken
```

### 10.3 Flux Logout

```
1. Client envoie refreshToken
2. lougoutController supprime le token en BDD
3. Efface le cookie
```

---

# 💾 11. Transactions MySQL

Utilisées pour garantir l'intégrité des données :

```js
const createNewUser = async (username, password) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction(); // 🔒 Début transaction

    // ✅ INSERT user
    const [newUser] = await connection.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPwd],
    );

    // ✅ INSERT user_role
    await connection.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
      [newUser.insertId, DEFAULT_ROLE_ID],
    );

    await connection.commit(); // ✅ Valide tout
    return { success: true, userId: newUser.insertId };
  } catch (err) {
    if (connection) await connection.rollback(); // ❌ Annule tout
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
```

**Pourquoi?** Si l'INSERT user_role échoue, l'INSERT user est annulé aussi.

---

# 📊 12. Tous les Contrôleurs avec try-catch

Chaque contrôleur doit avoir la signature `(req, res, next)` et `next(err)`:

```js
const handleAction = async (req, res, next) => {
  try {
    // Logique métier
    const result = await model.doSomething();
    res.json(result);
  } catch (err) {
    next(err); // ✅ Toujours passer au middleware
  }
};
```

---

# 🔍 13. Destructuring en Base de Données

```js
const [rows] = await db.query("SELECT ...");
// rows est un tableau

const [result] = await db.query("INSERT ...");
// result contient insertId, affectedRows, etc.

return rows[0]; // Retourner un objet, pas un array
```

---

# ✅ 14. Checklist Sceance 14

- ✅ Créer 3 modèles (usersModel, authModel, employeesModel)
- ✅ Ajouter try-catch à TOUS les contrôleurs
- ✅ Ajouter paramètre `next` à TOUS les handlers
- ✅ Utiliser `next(err)` pour les erreurs techniques
- ✅ Utiliser `res.status().json()` pour les erreurs métier
- ✅ Importer ROLES_LIST pour les rôles
- ✅ Utiliser les transactions pour créer un utilisateur
- ✅ Logger les erreurs avec le middleware
- ✅ Jamais de `db.query()` dans les contrôleurs
- ✅ Toujours valider les entrées utilisateur

---

# 🎯 15. Bonnes Pratiques Appliquées

| Pratique        | Avant            | Après                    |
| --------------- | ---------------- | ------------------------ |
| Logique métier  | Contrôleur       | Modèle ✅                |
| Gestion erreurs | Pas de gestion   | try-catch + next(err) ✅ |
| Tokens          | Hardcodés        | authModel ✅             |
| Rôles           | Nombres magiques | ROLES_LIST ✅            |
| Connexions      | Une seule        | Pool ✅                  |
| Transactions    | Aucune           | Avec rollback ✅         |

---

# 🏆 16. Résumé Final

Cette sceance enseigne **l'architecture d'une API Express professionnelle** :

1. **Modèles** - Toute la logique accès BDD
2. **Contrôleurs** - Demandent au modèle, retournent au client
3. **Erreurs** - Centralisées avec middleware
4. **Authentification** - JWT + Refresh Tokens + Rôles
5. **Sécurité** - Bcrypt, parameterized queries, transactions
6. **Logging** - Toutes les erreurs enregistrées

Cette structure permet une **maintenabilité, scalabilité et sécurité maximales** ✨

---

# 🎓 Conclusion

L'architecture MVC avec Express + MySQL est la **base de toute application web moderne**.

Maîtriser cette sceance te permet de construire des APIs professionnelles ! 🚀
