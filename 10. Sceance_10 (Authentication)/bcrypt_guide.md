# 🔐 Guide Complet -- BCRYPT en Backend (Express / Node.js)

Ce document explique en détail :

-   ✅ C'est quoi bcrypt
-   ✅ Pourquoi on l'utilise
-   ✅ Ce qu'est un hash
-   ✅ Ce qu'est un salt
-   ✅ Comment fonctionne bcrypt.hash()
-   ✅ Comment fonctionne bcrypt.compare()
-   ✅ Pourquoi c'est sécurisé
-   ✅ Bonnes pratiques en production

------------------------------------------------------------------------

# 1️⃣ C'est quoi bcrypt ?

bcrypt est une librairie de **hash sécurisé des mots de passe**.

Son rôle est de :

> Transformer un mot de passe en une chaîne sécurisée irréversible
> (hash).

On ne stocke **jamais** un mot de passe en clair dans une base de
données.

------------------------------------------------------------------------

# 2️⃣ Pourquoi ne jamais stocker un mot de passe en clair ?

Exemple dangereux :

{ "username": "abderrahmane", "pwd": "123456" }

Si la base est piratée, tous les mots de passe sont visibles.

Avec bcrypt :

{ "username": "abderrahmane", "pwd": "\$2b$10$ZzUORY4iDvQf0.mPFJOdKe..."
}

Le mot de passe devient illisible.

------------------------------------------------------------------------

# 3️⃣ C'est quoi un hash ?

Un hash est :

-   Une transformation mathématique
-   Irréversible
-   Toujours de longueur fixe
-   Impossible à "décrypter"

On ne peut pas récupérer le mot de passe original à partir du hash.

------------------------------------------------------------------------

# 4️⃣ Le concept de SALT

bcrypt ajoute automatiquement un **salt**.

Un salt est : \> Une valeur aléatoire ajoutée au mot de passe avant
hash.

Cela signifie :

Même mot de passe ≠ même hash

Exemple :

Mot de passe : 123456

Utilisateur A → hash1\
Utilisateur B → hash2

Même mot de passe → hash différents.

Cela protège contre les attaques par rainbow table.

------------------------------------------------------------------------

# 5️⃣ Structure d'un hash bcrypt

Exemple :

\$2b$10$ZzUORY4iDvQf0.mPFJOdKe...

Décodage :

-   $2b$ → version bcrypt
-   10 → nombre de rounds (complexité)
-   reste → salt + hash

------------------------------------------------------------------------

# 6️⃣ bcrypt.hash()

Utilisé pendant l'inscription.

Exemple :

const hashedPwd = await bcrypt.hash(pwd, 10)

Explication :

-   pwd = mot de passe en clair
-   10 = nombre de rounds (coût)

Plus le nombre est élevé : - Plus sécurisé - Plus lent

10 est un bon compromis pour la plupart des projets.

------------------------------------------------------------------------

# 7️⃣ bcrypt.compare()

Utilisé pendant le login.

Exemple :

const match = await bcrypt.compare(pwd, UserFound.pwd)

Ce que ça fait :

-   Hash automatiquement le mot de passe envoyé
-   Compare avec le hash stocké
-   Retourne true ou false

------------------------------------------------------------------------

# 8️⃣ Pourquoi ne pas faire :

if (pwd === UserFound.pwd)

Parce que :

-   pwd = mot de passe en clair
-   UserFound.pwd = hash

Ils ne peuvent jamais être identiques.

------------------------------------------------------------------------

# 9️⃣ Sécurité de bcrypt

bcrypt est sécurisé parce que :

-   Il utilise un salt
-   Il ralentit les attaques bruteforce
-   Il rend chaque hash unique
-   Il est largement utilisé en production

------------------------------------------------------------------------

# 🔟 Attaques que bcrypt aide à prévenir

✔ Rainbow Table Attack\
✔ Brute Force (ralentie fortement)\
✔ Database Leak exploitation

------------------------------------------------------------------------

# 11️⃣ Limitations

bcrypt :

-   Protège seulement le stockage du mot de passe
-   Ne protège pas les routes
-   Ne crée pas de session
-   Ne gère pas l'autorisation

Il doit être combiné avec : - JWT - Sessions - Middleware
d'authorization

------------------------------------------------------------------------

# 12️⃣ Bonnes pratiques

✔ Toujours hasher avant de sauvegarder\
✔ Ne jamais logguer un mot de passe\
✔ Utiliser async/await\
✔ Utiliser au moins 10 rounds\
✔ Stocker les secrets dans .env

------------------------------------------------------------------------

# 13️⃣ Flow complet avec bcrypt

## Inscription

Client\
↓\
Mot de passe envoyé\
↓\
bcrypt.hash()\
↓\
Stockage du hash

------------------------------------------------------------------------

## Login

Client\
↓\
Mot de passe envoyé\
↓\
bcrypt.compare()\
↓\
Accès accordé ou refusé

------------------------------------------------------------------------

# Conclusion

bcrypt est un outil essentiel pour sécuriser les mots de passe.

Il garantit que même si la base de données est compromise : - Les mots
de passe ne sont pas directement exploitables.

C'est une brique fondamentale de la sécurité backend moderne.
