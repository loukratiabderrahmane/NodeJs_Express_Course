# 📘 La Notion de MVC (Model View Controller) — Sceance 9

Ce document explique clairement :

-   ✅ C'est quoi MVC
-   ✅ Le rôle de chaque partie (Model, View, Controller)
-   ✅ Comment ça fonctionne ensemble
-   ✅ Exemple concret avec Express
-   ✅ Structure professionnelle d'un projet

------------------------------------------------------------------------

# 1️⃣ Définition de MVC

MVC signifie :

Model -- View -- Controller

C'est un **pattern d'architecture** utilisé pour organiser proprement
une application backend ou frontend.

Il permet de séparer les responsabilités pour rendre le code : - Plus
clair - Plus maintenable - Plus scalable

------------------------------------------------------------------------

# 2️⃣ Les 3 Composants du MVC

## 🟢 1) Model

Le Model gère :

-   Les données
-   La base de données
-   Les fichiers JSON
-   La logique liée aux données

Exemple dans Express :

``` js
const data = {
  employees: require('../model/employees.json'),
  setEmployees: function(data) {
    this.employees = data
  }
}
```

👉 Le Model ne s'occupe PAS des requêtes HTTP.

------------------------------------------------------------------------

## 🔵 2) View

La View représente ce que l'utilisateur voit.

Cela peut être : - Une page HTML - Une réponse JSON - Une interface
frontend

Exemple :

``` js
res.json(data.employees)
```

ou

``` js
res.sendFile('index.html')
```

👉 La View affiche les données.

------------------------------------------------------------------------

## 🟣 3) Controller

Le Controller est l'intermédiaire entre Model et View.

Il : - Reçoit la requête - Utilise le Model - Envoie la réponse

Exemple :

``` js
const getAllEmployees = (req, res) => {
   res.json(data.employees)
}
```

👉 Il contient la logique métier.

------------------------------------------------------------------------

# 3️⃣ Comment MVC fonctionne ensemble ?

Schéma simple :

Client\
↓\
Controller\
↓\
Model\
↓\
Controller\
↓\
View (réponse envoyée)

------------------------------------------------------------------------

# 4️⃣ Exemple concret avec Express

## 📁 Structure professionnelle

    project/
    │
    ├── model/
    │   └── employees.json
    │
    ├── controllers/
    │   └── employeesController.js
    │
    ├── routes/
    │   └── employees.js
    │
    ├── server.js

------------------------------------------------------------------------

## 🔹 Model (employees.json)

``` json
[
  { "id": 1, "firstname": "John" }
]
```

------------------------------------------------------------------------

## 🔹 Controller (employeesController.js)

``` js
const data = require('../model/employees.json')

const getAllEmployees = (req, res) => {
   res.json(data)
}

module.exports = { getAllEmployees }
```

------------------------------------------------------------------------

## 🔹 Router (employees.js)

``` js
const express = require('express')
const router = express.Router()
const controller = require('../controllers/employeesController')

router.get('/', controller.getAllEmployees)

module.exports = router
```

------------------------------------------------------------------------

## 🔹 server.js

``` js
const express = require('express')
const app = express()

app.use('/employees', require('./routes/employees'))

app.listen(3500)
```

------------------------------------------------------------------------

# 5️⃣ Pourquoi MVC est important ?

Sans MVC : - Fichier serveur énorme - Code mélangé - Maintenance
difficile

Avec MVC : - Code organisé - Séparation des responsabilités - Facile à
agrandir - Structure professionnelle

------------------------------------------------------------------------

# 6️⃣ Résumé rapide

  Partie       Rôle
  ------------ ----------------------
  Model        Gère les données
  View         Affiche les données
  Controller   Logique et décisions

------------------------------------------------------------------------

# 7️⃣ Conclusion

MVC est une architecture utilisée dans presque tous les frameworks
modernes :

-   Express
-   Laravel
-   Django
-   Spring
-   ASP.NET

Maîtriser MVC = comprendre comment construire un backend propre et
professionnel.

