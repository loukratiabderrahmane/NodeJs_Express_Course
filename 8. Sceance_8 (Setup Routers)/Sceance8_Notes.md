# Organisation des routes avec Express Router — Sceance 8

## 1. Problème de base : tout dans `server.js`

Dans une petite application Express, on met souvent toutes les routes dans un seul fichier `server.js` (ou `app.js`).[page:1] Quand l’application grossit, ce fichier devient long, confus et difficile à maintenir, car il mélange configuration du serveur, middlewares et nombreuses routes.[page:1]  
L’idée principale est donc de déléguer les routes à des fichiers séparés, puis de les connecter au serveur principal avec `app.use(...)`.[page:1]

## 2. Qu’est‑ce qu’un Router dans Express ?

`express.Router()` permet de créer une sorte de mini‑application qui gère un groupe de routes comme un petit serveur Express.[page:1]  
Ce router peut ensuite être exporté depuis un fichier et branché sur le serveur principal avec un chemin de base, par exemple `/subdir` ou `/employees`.[page:1]

Schéma logique simple :

- `server.js` : configure Express, les middlewares globaux, et fait `app.use('/subdir', subdirRouter)` et `app.use('/employees', employeesRouter)`.[page:1]
- `routes/subdir.js` : définit les routes `/`, `/test`, etc. relatives à `/subdir`.[page:1]
- `routes/api/employees.js` : définit les routes API `/`, `/:id` relatives à `/employees`.[page:1]

## 3. Création d’un router pour un sous‑dossier (`subdir`)

### 3.1 Structure de fichiers

On crée par exemple :

- `routes/subdir.js` pour les routes du sous‑dossier.[page:1]
- `views/subdir/index.html`, `views/subdir/test.html` pour les pages à servir.[page:1]

### 3.2 Code de base d’un router

Dans `routes/subdir.js` :

- Importer Express et `path`.[page:1]
- Créer un router avec `const router = express.Router();`.[page:1]
- Définir des routes avec `router.get('/...')` pour servir les fichiers HTML avec `res.sendFile(...)`.[page:1]
- Exporter le router avec `module.exports = router;` pour l’utiliser dans `server.js`.[page:1]

### 3.3 Connexion au serveur

Dans `server.js` :

- `app.use('/subdir', require('./routes/subdir'));` indique que toutes les requêtes commençant par `/subdir` seront gérées par ce router.[page:1]

Ainsi :

- L’URL `/subdir` correspond à `router.get('/')` dans `subdir.js`.[page:1]
- L’URL `/subdir/test` correspond à `router.get('/test')`.[page:1]

## 4. Fichiers statiques et sous‑dossiers

Express peut servir des fichiers statiques (CSS, images, JS) avec `express.static(...)`.[page:1]  
En général, on écrit `app.use(express.static(path.join(__dirname, 'public')))` pour rendre les fichiers du dossier `public` accessibles.[page:1]

Problème dans le sous‑dossier :

- Une page 404 sous `/subdir` n’a pas de styles, car le middleware statique n’est pas appliqué à ce chemin.[page:1]

Solution :

- Ajouter un middleware statique spécifique pour `/subdir`, par exemple `app.use('/subdir', express.static(path.join(__dirname, 'public')))`.[page:1]
- Ainsi, les pages sous `/subdir` peuvent aussi charger les fichiers CSS/JS/images depuis `public`.[page:1]

Concept clé : un middleware statique peut être monté sur un chemin donné (`/` ou `/subdir`), et ce chemin influence quelles URLs peuvent accéder aux fichiers.[page:1]

## 5. Router pour la racine (`/`) : `routes/root.js`

Au lieu de tout laisser dans `server.js`, on crée un router pour la racine du site.[page:1]

### 5.1 Routes typiques dans `root.js`

Exemples de routes traitées :

- `/` ou `/index(.html)?` pour la page d’accueil.[page:1]
- `/new-page(.html)?` pour une nouvelle page.[page:1]
- `/old-page(.html)?` qui redirige vers `/new-page.html`.[page:1]

Les routes sont définies avec `router.get(...)` au lieu de `app.get(...)`.[page:1]  
Les fichiers HTML sont envoyés avec `res.sendFile(...)` et `path.join(...)` pour construire le chemin absolu vers `views/...`.[page:1]

### 5.2 Connexion dans `server.js`

On branche ce router avec :

- `app.use('/', require('./routes/root'))`.[page:1]

Cela signifie que toutes les requêtes commençant par `/` sont d’abord envoyées à ce router, qui décide de la réponse.[page:1]

## 6. Introduction à un router d’API REST (`/employees`)

### 6.1 Objectif

On veut construire une petite API REST pour gérer une ressource “employees”.[page:1]  
Une ressource en REST est un ensemble d’objets logiques (ici des employés) accessibles via des URLs (`/employees`, `/employees/1`, etc.).[page:1]

### 6.2 Structure

- Fichier de données : `data/employees.json` avec une liste d’employés (champs `id`, `firstname`, `lastname`).[page:1]
- Router API : `routes/api/employees.js`.[page:1]
- Branchement : `app.use('/employees', require('./routes/api/employees'))` dans `server.js`.[page:1]

Dans `employees.js` :

- `const router = express.Router();` pour créer le router.[page:1]
- Chargement des données dans un objet, par exemple `data.employees = require('../../data/employees.json')`.[page:1]
- Définition des routes REST avec `router.route('/')` et `router.route('/:id')`.[page:1]

## 7. Chaînage des méthodes HTTP avec `router.route()`

Express propose la méthode `router.route(path)` qui permet de définir plusieurs méthodes HTTP pour la même URL, de façon groupée.[page:1]

### 7.1 Route sur `/employees` (chemin `/` dans le router)

Dans `employees.js` :

- `router.route('/')` crée un bloc pour toutes les méthodes sur `/employees`.[page:1]

Dans ce bloc :

- `.get((req, res) => { res.json(data.employees); })` renvoie la liste complète des employés.[page:1]
- `.post((req, res) => { res.json({ firstname: req.body.firstname, lastname: req.body.lastname }); })` illustre la création d’un employé en lisant les données du body.[page:1]
- `.put((req, res) => { ... })` illustre une mise à jour en renvoyant les données reçues.[page:1]
- `.delete((req, res) => { res.json({ id: req.body.id }); })` illustre la suppression d’un employé via un `id` reçu dans le body.[page:1]

### 7.2 Lien avec CRUD

Les méthodes HTTP correspondent au modèle CRUD :

- `GET /employees` → Read (lire la liste).[page:1]
- `POST /employees` → Create (créer un nouvel employé).[page:1]
- `PUT /employees` → Update (mettre à jour un employé existant).[page:1]
- `DELETE /employees` → Delete (supprimer un employé).[page:1]

Dans la vidéo, cela sert surtout de démonstration : les réponses renvoient ce qui est reçu, sans modifier réellement le fichier JSON.[page:1]

## 8. Paramètres d’URL : `/:id`

Pour gérer une ressource individuelle, on utilise une URL avec un paramètre :

- `router.route('/:id')` crée une route pour des URL comme `/employees/1`, `/employees/2`, etc.[page:1]

Dans le handler :

- `req.params.id` permet de récupérer la valeur du paramètre dans l’URL (par exemple `"1"` pour `/employees/1`).[page:1]
- On peut répondre avec un JSON qui contient cet ID, ou plus tard chercher l’employé correspondant dans la liste et renvoyer ses données.[page:1]

Concept clé : `:id` est un named parameter dans Express, et `req.params` contient tous ces paramètres.[page:1]

## 9. Test de l’API avec un client HTTP (Thunder Client)

Plutôt que de tester les routes API dans le navigateur, on utilise un client HTTP comme Thunder Client dans VS Code.[page:1]

On peut y tester :

- `GET /employees` pour voir la liste des employés en JSON.[page:1]
- `POST /employees` avec un body JSON contenant `firstname` et `lastname`.[page:1]
- `PUT /employees` avec des données de mise à jour.[page:1]
- `DELETE /employees` avec un body contenant un `id`.[page:1]
- `GET /employees/1` pour vérifier le fonctionnement du paramètre `:id`.[page:1]

Points à retenir :

- La méthode HTTP (GET, POST, PUT, DELETE) change l’intention de l’action.[page:1]
- Le body est essentiel pour POST, PUT, DELETE, et requiert un middleware comme `express.json()` pour être parsé.[page:1]
- Les paramètres d’URL servent à cibler une ressource spécifique.[page:1]

## 10. Vers une architecture MVC (Model–View–Controller)

Étape suivante : organiser le code en pattern MVC.[page:1]

- Model : représente les données et l’accès aux données (fichiers, base de données, validations, etc.).[page:1]
- View : représente ce que l’on renvoie au client (HTML, JSON, etc.).[page:1]
- Controller : contient la logique métier, reçoit la requête, appelle les modèles, choisit la réponse.[page:1]

Dans un projet Express :

- Les routers dirigent les requêtes vers les contrôleurs appropriés.[page:1]
- Les contrôleurs utilisent les modèles pour gérer les données et produisent des réponses sous forme de vues HTML ou de JSON.[page:1]

L’objectif de MVC est de séparer les responsabilités pour obtenir une application plus lisible, maintenable, testable et extensible.[page:1]
