
# 📘 GUIDE COMPLET – .ENV & JWT (Authentication Moderne avec Express) - Sceance 11

Ce document regroupe TOUT ce que nous avons vu sur :

- 🔐 Les variables d’environnement (.env)
- 🛡 JWT (JSON Web Token)
- 🔁 Access Token
- 🔄 Refresh Token
- 🍪 Cookies httpOnly
- 🔁 Token Rotation
- 🚪 Logout sécurisé
- 🧠 verifyJWT middleware
- 🛡 Bonnes pratiques sécurité

---

# 1️⃣ Les Variables d’Environnement (.env)

## 🎯 Pourquoi utiliser .env ?

Un fichier `.env` permet de stocker :

- Clés secrètes
- Clés JWT
- Ports
- URLs base de données
- Configurations sensibles

On ne doit jamais mettre ces informations directement dans le code.

---

## 📁 Exemple de fichier .env

PORT=3500
ACCESS_TOKEN_SECRET=superSecretAccessKey
REFRESH_TOKEN_SECRET=superSecretRefreshKey

---

## ⚙️ Utilisation dans Express

Installation :

npm install dotenv

Dans server.js :

require('dotenv').config()

Accès aux variables :

process.env.PORT
process.env.ACCESS_TOKEN_SECRET

---

## 🚨 Important

Toujours ajouter dans .gitignore :

.env

Sinon vos secrets seront publiés sur GitHub.

---

# 2️⃣ JWT (JSON Web Token)

## 🧠 C’est quoi un JWT ?

JWT = JSON Web Token

Il contient :

HEADER.PAYLOAD.SIGNATURE

---

## 📦 Structure d’un JWT

Header → Algorithme  
Payload → Données utilisateur  
Signature → Créée avec SECRET  

Si le token est modifié → signature invalide.

---

# 3️⃣ Création d’un Access Token

const accessToken = jwt.sign(
   { username: user },
   process.env.ACCESS_TOKEN_SECRET,
   { expiresIn: '15m' }
)

Court (5–15 minutes)  
Utilisé pour accéder aux routes protégées

---

# 4️⃣ Création d’un Refresh Token

const refreshToken = jwt.sign(
   { username: user },
   process.env.REFRESH_TOKEN_SECRET,
   { expiresIn: '1d' }
)

Long (1 jour ou plus)  
Sert à générer un nouveau access token

---

# 5️⃣ verifyJWT Middleware

const verifyJWT = (req, res, next) => {
   const authHeader = req.headers['authorization']
   if (!authHeader) return res.sendStatus(401)

   const token = authHeader.split(' ')[1]

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403)
      req.user = decoded.username
      next()
   })
}

401 = pas de token  
403 = token invalide

---

# 6️⃣ Cookie httpOnly pour Refresh Token

res.cookie('jwt', refreshToken, {
   httpOnly: true,
   secure: true,
   sameSite: 'None'
})

- httpOnly → protège contre XSS
- secure → HTTPS uniquement
- sameSite → protection CSRF

---

# 7️⃣ Flow Complet Authentification

LOGIN  
↓  
Création access + refresh  
↓  
Access envoyé en JSON  
↓  
Refresh stocké en cookie  

---

# 8️⃣ Route /refresh

Quand access token expire :

Client → GET /refresh  

Serveur :

- Vérifie cookie
- Vérifie refresh token en base
- Génère nouveau access token

---

# 9️⃣ Token Rotation

À chaque refresh :

- Nouveau refresh token généré
- Ancien supprimé en base
- Cookie mis à jour

Cela empêche la réutilisation d’un token volé.

---

# 🔟 Logout Sécurisé

res.clearCookie('jwt', { httpOnly: true })

En base :

refreshToken = ''

Même si un hacker possède l’ancien token → il devient invalide.

---

# 1️⃣1️⃣ Différence Access vs Refresh

Access → Court → Accès aux routes  
Refresh → Long → Générer nouveau access  

---

# 1️⃣2️⃣ Bonnes Pratiques Production

✔ Utiliser HTTPS  
✔ httpOnly cookies  
✔ Token rotation  
✔ Secrets dans .env  
✔ .env dans .gitignore  
✔ Access token court  
✔ Refresh token stocké en base  

---

# 🎯 Conclusion

Avec .env + JWT + Refresh Token + Rotation + Logout sécurisé :

Vous avez une architecture d’authentification moderne utilisée en production.

Vous maîtrisez maintenant :

- Variables d’environnement
- JWT
- Access Token
- Refresh Token
- Middleware verifyJWT
- Cookie sécurisé
- Token Rotation
- Logout sécurisé

🔥 Niveau Backend Intermédiaire Avancé.
