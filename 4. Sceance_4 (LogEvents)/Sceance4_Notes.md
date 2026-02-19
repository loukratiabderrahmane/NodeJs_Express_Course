# EVENTS ET LOGS EN NODE.JS – Notes de cours (Séance 4)

---

## 1) EVENT (ÉVÉNEMENT)

Un **event (événement)** est une action qui se produit dans une application  
ou un serveur à un moment donné.

### Exemples d’événements :
- Démarrage du serveur
- Connexion d’un utilisateur
- Réception d’une requête
- Apparition d’une erreur

👉 Un événement signifie :  
**« quelque chose vient de se produire »**

---

## 2) LOG EVENT

Un **log event** est un événement **enregistré** afin de garder une trace  
de ce qui se passe dans le système.

Un log event permet de savoir :
- ce qui s’est passé
- quand cela s’est passé
- où cela s’est passé

📌 Les logs sont utilisés pour :
- le suivi
- le débogage
- la surveillance

---

## 3) `console.log` ET `console.error`

### `console.log`
- affiche des informations normales
- sert au suivi de l’exécution du programme
- écrit dans la sortie standard (**stdout**)

### `console.error`
- affiche des erreurs
- sert à signaler un problème
- écrit dans la sortie d’erreur (**stderr**)

---

## 4) MODULE `events` ET `EventEmitter`

- `events` est un **module natif de Node.js**
- `EventEmitter` est une **classe fournie par le module `events`**

```js
const EventEmitter = require('events');
```

---

## 5) POURQUOI HÉRITER DE `EventEmitter`

On crée une classe qui hérite de `EventEmitter` pour :
- organiser le code
- donner un sens métier aux événements
- ajouter des méthodes personnalisées
- éviter le mélange des responsabilités
- rendre le projet plus maintenable et évolutif

```js
class MyEmitter extends EventEmitter {}
```

---

## 6) NOM DES ÉVÉNEMENTS

Les noms des événements (ex : `log`, `error`, `userCreated`) :
- sont des chaînes de caractères
- ne sont pas des mots réservés
- peuvent être choisis librement

⚠️ **Règle importante**  
Le nom de l’événement doit être **exactement le même**  
dans `on()` et dans `emit()`.

---

## 7) `on()` ET `emit()`

```txt
on()   = écouter un événement
emit() = déclencher un événement
```

---

## 8) FONCTIONNEMENT GLOBAL

1. Un écouteur est enregistré avec `on()`
2. Un événement est déclenché avec `emit()`
3. `EventEmitter` détecte l’événement
4. Les fonctions associées sont exécutées
5. Les données envoyées sont traitées

---

## 9) PHRASE CLÉ À RETENIR

Le module `events` et la classe `EventEmitter` permettent de gérer  
une communication asynchrone basée sur des événements en Node.js  
grâce aux méthodes `on()` et `emit()`.
