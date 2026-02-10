# Créer un serveur web avec Node.js (module `http`) — Résumé complet

Ce mémo résume **comment créer un serveur web sans Express** en Node.js, en s’inspirant du code que tu as envoyé : serveur HTTP, routes/fichiers statiques, `Content-Type`, erreurs, logs avec `EventEmitter`, redirections, et port.

---

## 1) Pré-requis & structure simple

### Pré-requis
- Node.js installé
- Un dossier de projet (ex: `my-server/`)

### Exemple de structure (style de ton code)
```
my-server/
├─ server.js
├─ logEvents.js
├─ views/
│  ├─ index.html
│  ├─ 404.html
│  └─ ... autres pages .html
├─ public/ (optionnel)
│  ├─ css/style.css
│  ├─ js/app.js
│  └─ images/...
```

> Dans ton code, les pages HTML sont dans `views/`, et les fichiers statiques (css/js/images) sont servis via le chemin demandé (`req.url`).

---

## 2) Le principe d’un serveur HTTP Node

Avec le module `http`, le serveur fait 3 choses :
1. **Écouter un port** (`server.listen(PORT)`)
2. **Recevoir une requête** (`req`: URL, méthode, headers…)
3. **Envoyer une réponse** (`res`: status, headers, body)

---

## 3) Démarrer un serveur minimal

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Serveur Node OK ✅");
});

server.listen(3000, () => console.log("http://localhost:3000"));
```

- `res.writeHead(status, headers)` : envoie le **code HTTP** + les **headers**
- `res.end(body)` : envoie le contenu et **termine** la réponse

---

## 4) Port dynamique : `process.env.PORT || 3500`

```js
const PORT = process.env.PORT || 3500;
```

- En **production**, une plateforme peut imposer un port via `PORT`
- En **local**, si `PORT` n’existe pas, on utilise `3500`

---

## 5) Servir des fichiers (HTML/CSS/JS/Images/JSON)

### Pourquoi c’est important ?
Au lieu de coder plein de `if/else` pour chaque page, tu peux :
- convertir une URL en **chemin de fichier**
- vérifier s’il existe
- le lire
- l’envoyer avec le bon **Content-Type**

Ton code fait ça avec une fonction `serveFile()`.

---

## 6) `Content-Type` (très important)

Le navigateur doit savoir **quel type de contenu** il reçoit :

| Extension | Content-Type |
|----------|--------------|
| `.html`  | `text/html` |
| `.css`   | `text/css` |
| `.js`    | `text/javascript` |
| `.json`  | `application/json` |
| `.png`   | `image/png` |
| `.jpg`   | `image/jpeg` |
| `.txt`   | `text/plain` |

Dans ton code :
- `path.extname(req.url)` récupère l’extension
- un `switch` choisit le `contentType`

---

## 7) Construire le chemin du fichier (`filePath`)

Ton serveur choisit **où chercher le fichier** selon l’URL.

### Cas gérés dans ton code

1. `/` → `views/index.html`
2. URL qui finit par `/` (ex: `/blog/`) → `views/blog/index.html`
3. HTML normal (ex: `/about.html`) → `views/about.html`
4. Fichiers statiques (ex: `/css/style.css`) → `__dirname + req.url`

Ensuite, il ajoute `.html` si besoin :
```js
if (!extension && req.url.slice(-1) !== '/') filePath += '.html';
```
Ex: `/about` devient `/about.html`.

---

## 8) Vérifier si le fichier existe

Ton code utilise :
```js
const fileExists = fs.existsSync(filePath);
```

- Si le fichier existe → on le sert (`serveFile(...)`)
- Sinon → redirection (301) ou page 404

---

## 9) La fonction `serveFile()` (le cœur)

Dans ton code, `serveFile(filePath, contentType, res)` :

### A) Lit le fichier en async/await
```js
const rawData = await fsPromises.readFile(
  filePath,
  !contentType.includes('image') ? 'utf8' : ''
);
```
- Texte → `utf8`
- Image → lecture binaire

### B) JSON : parse puis stringify
```js
const data = contentType === 'application/json'
  ? JSON.parse(rawData)
  : rawData;
```

### C) Envoie status + headers + body
```js
response.writeHead(
  filePath.includes('404.html') ? 404 : 200,
  { 'Content-Type': contentType }
);

response.end(
  contentType === 'application/json' ? JSON.stringify(data) : data
);
```

👉 Le ternaire :
- si on sert `404.html` → status `404`
- sinon → status `200`

### D) Gestion d’erreur
En cas d’erreur de lecture ou autre :
- log de l’erreur
- status `500`
- `response.end()`

---

## 10) Redirections 301

Quand un fichier n’existe pas, ton code peut rediriger :
```js
res.writeHead(301, { location: "/new-page.html" });
res.end();
```

- `301` = redirection permanente
- `location` = nouvelle URL

---

## 11) Logs avec `EventEmitter` (propre et pro)

Ton code met en place :
- un `Emitter`
- un événement `log`
- une fonction `logEvents(msg, fileName)` pour écrire dans un fichier

### Exemple
- À chaque requête :
```js
myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')
```
- En cas d’erreur :
```js
myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt')
```

**Avantage :**
- centraliser les logs
- garder ton `server.js` propre
- séparer “logique serveur” et “logique logs”

---

## 12) Checklist : serveur web Node (sans Express)

✅ `http.createServer((req,res)=>{})`  
✅ déterminer `contentType` via l’extension  
✅ mapper URL → `filePath`  
✅ vérifier existence (`existsSync`)  
✅ lire le fichier (`fsPromises.readFile`)  
✅ envoyer headers + status + body (`writeHead` + `end`)  
✅ 404 + 500  
✅ redirections 301  
✅ logs (req + errors) avec `EventEmitter`

---

## 13) Erreurs fréquentes & tips

- **Oublier `res.end()`** → la requête reste “loading”
- Mauvais `Content-Type` → HTML affiché comme texte, accents cassés, images illisibles
- Utiliser `path.join()` pour éviter les problèmes Windows/Linux
- Toujours gérer au minimum : `200`, `404`, `500`

---

**Fin.**
