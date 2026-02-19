
# 📘 Guide Complet – Authentification Sans Token (Projet MVC Express)


# 1️⃣ Définition : Authentification sans token

L’authentification consiste à vérifier :

> "Qui es-tu ?"

Dans ce projet, l’authentification se fait sans :
- JWT
- Session
- Cookie sécurisé

Cela signifie :
- On vérifie les identifiants
- On répond si c’est correct
- Mais on ne garde aucune trace de connexion

Donc l’API reste publique après login.

---

# 2️⃣ Structure du projet (Architecture MVC)

Scene_10 (Authentication)

- controllers/
    - registerController.js
    - authController.js

- routes/
    - register.js
    - auth.js

- model/
    - users.json

- middleware/
    - errorHandler.js

- server.js

---

# 3️⃣ Rôle de chaque partie

## 🔹 Model (users.json)

Contient les utilisateurs enregistrés :

Exemple :

{
  "username": "Abderrahmane",
  "pwd": "$2b$10$..."
}

Le mot de passe est stocké HASHÉ (pas en clair).

---

## 🔹 Controllers

Les controllers contiennent la logique métier.

Ils :
- Reçoivent la requête
- Vérifient les données
- Accèdent au model
- Renvoient la réponse

Ils ne définissent pas les routes.

---

## 🔹 Routes

Les routes définissent quelle URL appelle quelle fonction controller.

Exemple :

POST /register → handleNewUser  
POST /auth → handleAuth

---

# 4️⃣ Fonctionnement de l'inscription (Register)

Étapes :

1. Récupérer user et pwd depuis req.body
2. Vérifier s’ils existent → sinon 400
3. Vérifier si username déjà utilisé → sinon 409
4. Hasher le mot de passe avec bcrypt
5. Créer un nouvel utilisateur
6. Sauvegarder dans users.json
7. Retourner 201 (Created)

---

## 🔐 Rôle de bcrypt

bcrypt sert à :

- Hasher le mot de passe
- Protéger les données

Exemple logique :

bcrypt.hash(pwd, 10)

Le "10" représente le niveau de complexité du hash.

---

# 5️⃣ Fonctionnement du Login

Étapes :

1. Vérifier user + pwd → sinon 400
2. Chercher l’utilisateur dans users.json
3. Si non trouvé → 404
4. Comparer mot de passe avec bcrypt.compare()
5. Si match → succès
6. Sinon → 401

bcrypt.compare(pwd, UserFound.pwd)

Cela compare :
- Le mot de passe envoyé
- Le mot de passe hashé stocké

---

# 6️⃣ Codes HTTP utilisés

400 → Mauvaise requête  
401 → Non autorisé  
404 → Utilisateur non trouvé  
409 → Conflit (duplicate)  
201 → Créé avec succès  
500 → Erreur serveur  

---

# 7️⃣ Flow complet Register

Client  
↓  
POST /register  
↓  
Controller vérifie données  
↓  
bcrypt.hash()  
↓  
Ajout dans users.json  
↓  
Réponse 201

---

# 8️⃣ Flow complet Login

Client  
↓  
POST /auth  
↓  
Controller vérifie données  
↓  
Recherche utilisateur  
↓  
bcrypt.compare()  
↓  
Réponse succès ou erreur

---

# 9️⃣ Limitation de cette méthode

Sans token :

- Aucune session n’est créée
- Aucune protection des routes
- Après login, tout le monde peut accéder aux routes

Ce système vérifie seulement l’identité au moment du login.

---

# 🔟 Ce que tu maîtrises avec ce projet

- Architecture MVC
- Séparation routes / controllers
- Manipulation de fichiers JSON
- bcrypt (hash + compare)
- async/await
- Codes HTTP corrects
- Gestion d’erreurs

---

# Conclusion

Le système actuel implémente :

✔ Authentification sécurisée (avec hash)  
❌ Pas encore d’Autorisation  
❌ Pas de protection de routes  

C’est une base solide pour comprendre la sécurité backend.

Prochaine étape logique :
→ JWT  
→ Middleware verifyJWT  
→ Routes protégées  
