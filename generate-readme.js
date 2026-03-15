const fs   = require('fs')
const path = require('path')

const ROOT = __dirname

// ─── Convention des noms de dossiers ─────────────────────────────────────────
// Format attendu : NN_Sceance_NN_NomDeLaSeance
// Exemples :
//   01_Sceance_1_Modules
//   15_Sceance_15_Security
//   16_Sceance_16_Validation

// ─── 1. Scan auto des dossiers de séances ────────────────────────────────────
function detectSessions() {
  const entries = fs.readdirSync(ROOT, { withFileTypes: true })

  const sessionDirs = entries
    .filter(e => e.isDirectory() && /^\d{2}_Sceance_/.test(e.name))
    .map(e => e.name)
    .sort()

  return sessionDirs.map(folder => {
    const num    = folder.match(/^(\d{2})/)?.[1] ?? '??'
    const name   = extractName(folder)
    const tags   = extractTags(folder)
    return { n: num, folder, name, tags, done: true }
  })
}

// ─── 2. Extraire le nom lisible depuis le nom du dossier ─────────────────────
// "15_Sceance_15_Security"    → "Security"
// "14_Sceance_14_Architecture_MVC_Approfondie" → "Architecture MVC Approfondie"
function extractName(folder) {
  const parts = folder.split('_')
  // Sauter "NN", "Sceance", "NN" → garder le reste
  const nameParts = parts.slice(3)
  return nameParts.join(' ')
}

// ─── 3. Extraire les tags depuis le fichier de notes ─────────────────────────
// Cherche la ligne "## X. " ou les premiers headers H2 du fichier Notes
function extractTags(folder) {
  const dirPath  = path.join(ROOT, folder)
  const noteFile = findNoteFile(dirPath)

  if (!noteFile) return inferTagsFromName(folder)

  const content = fs.readFileSync(noteFile, 'utf8')

  // Cherche les lignes "- `xxx`" ou les mots en backticks dans le fichier
  const backtickMatches = [...content.matchAll(/`([^`\n]{2,30})`/g)]
    .map(m => m[1])
    .filter(t => !t.includes(' ') || t.length < 20)
    .slice(0, 3)

  if (backtickMatches.length >= 2) return backtickMatches

  // Fallback : extraire H2 headings
  const h2 = [...content.matchAll(/^## .+?\b(\w[\w\s]{3,25})/gm)]
    .map(m => m[0].replace(/^##\s*\d*[).]?\s*/, '').replace(/[`*]/g, '').trim())
    .filter(Boolean)
    .slice(0, 3)

  if (h2.length >= 2) return h2

  return inferTagsFromName(folder)
}

// ─── 4. Trouver le fichier de notes dans un dossier ──────────────────────────
function findNoteFile(dirPath) {
  if (!fs.existsSync(dirPath)) return null
  const files = fs.readdirSync(dirPath)
  const note  = files.find(f => f.endsWith('Notes.md') || f.endsWith('_Notes.md'))
  return note ? path.join(dirPath, note) : null
}

// ─── 5. Tags de fallback basés sur le nom du dossier ─────────────────────────
const KNOWN_TAGS = {
  'Modules':        ['CommonJS', 'ES Modules', 'require/exports'],
  'Files':          ['fs', 'streams', 'async/await'],
  'NPM':            ['package.json', 'semver', 'devDependencies'],
  'LogEvents':      ['EventEmitter', 'logging'],
  'WebServerNodeJs':['http module', 'Content-Type', 'serveFile'],
  'IntroToExpress': ['routing', 'regex routes', 'redirections'],
  'Middleware':     ['CORS', 'static files', 'custom middleware'],
  'Routers':        ['express.Router()', 'REST intro'],
  'MvcRestApi':     ['MVC pattern', 'controllers', 'CRUD'],
  'Authemtication': ['bcrypt', 'register/login'],
  'Authentication': ['bcrypt', 'register/login'],
  'JWT':            ['access token', 'refresh token', 'cookie'],
  'RBAC':           ['roles', 'verifyRoles', 'authorization'],
  'ConnectToDB':    ['MySQL pool', 'parameterized queries'],
  'Architecture':   ['models', 'transactions', 'next(err)'],
  'Security':       ['Helmet', 'Rate Limiting', 'secure cookie'],
  'Validation':     ['Joi', 'express-validator', 'schemas'],
  'Testing':        ['Jest', 'Supertest', 'integration tests'],
  'Config':         ['startup validation', 'centralized config'],
  'ORM':            ['Prisma', 'migrations', 'type-safe queries'],
  'FileUpload':     ['Multer', 'file validation', 'storage'],
  'WebSockets':     ['Socket.io', 'real-time', 'events'],
  'Emails':         ['Nodemailer', 'password reset', 'SMTP'],
  'Deployment':     ['Railway', 'GitHub Actions', 'CI/CD'],
}

function inferTagsFromName(folder) {
  const parts = folder.split('_').slice(3)
  for (const part of parts) {
    if (KNOWN_TAGS[part]) return KNOWN_TAGS[part]
  }
  const joined = parts.join('')
  for (const [key, tags] of Object.entries(KNOWN_TAGS)) {
    if (joined.toLowerCase().includes(key.toLowerCase())) return tags
  }
  return parts.filter(p => p.length > 2).slice(0, 3)
}

// ─── 6. Séances à venir (non créées encore) ───────────────────────────────────
const UPCOMING = [
  { n: '16', name: 'Validation',   tags: ['Joi', 'express-validator', 'schemas'] },
  { n: '17', name: 'Testing',      tags: ['Jest', 'Supertest', 'integration tests'] },
  { n: '18', name: 'Config',       tags: ['startup validation', 'centralized config'] },
  { n: '19', name: 'ORM',          tags: ['Prisma', 'migrations', 'type-safe queries'] },
  { n: '20', name: 'File Upload',  tags: ['Multer', 'file validation', 'storage'] },
  { n: '21', name: 'WebSockets',   tags: ['Socket.io', 'real-time', 'events'] },
  { n: '22', name: 'Emails',       tags: ['Nodemailer', 'password reset', 'SMTP'] },
  { n: '23', name: 'Deployment',   tags: ['Railway', 'GitHub Actions', 'CI/CD'] },
]

// Filtrer les upcoming qui n'existent pas encore
function getUpcoming(done) {
  const doneNums = new Set(done.map(s => s.n))
  return UPCOMING.filter(u => !doneNums.has(u.n))
}

// ─── 7. Générateur README ────────────────────────────────────────────────────
function progressBar(value, max, width = 30) {
  const filled = Math.round((value / max) * width)
  return '█'.repeat(filled) + '░'.repeat(Math.max(0, width - filled))
}

function buildRoadmap(done, todo, total) {
  const doneLines = done.map(s => {
    const isLatest = s.n === done[done.length - 1].n
    const tag = isLatest ? '  ← LATEST' : ''
    return `${s.n} ─── ${s.name.padEnd(22)} ${s.tags.join(' · ')}${tag}`
  }).join('\n')

  const todoLines = todo.map(s =>
    `${s.n} ─── ${s.name.padEnd(22)} ${s.tags.join(' · ')}`
  ).join('\n')

  return `### ✅ Completed (${done.length} / ${total})\n\n\`\`\`\n${doneLines}\n\`\`\`\n\n### 🔜 Upcoming (${todo.length})\n\n\`\`\`\n${todoLines}\n\`\`\``
}

function buildReadme(done, todo) {
  const total   = done.length + todo.length
  const pct     = Math.round((done.length / total) * 100)
  const latest  = done[done.length - 1]
  const nextUp  = todo[0]
  const now     = new Date().toISOString().split('T')[0]

  return `<div align="center">

\`\`\`
╔═══════════════════════════════════════════════════════════╗
║         NODE.JS & EXPRESS — BACKEND MASTERY JOURNEY       ║
║              From fundamentals to production-ready        ║
╚═══════════════════════════════════════════════════════════╝
\`\`\`

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Sessions](https://img.shields.io/badge/Sessions-${done.length}%20%2F%20${total}-4CAF50?style=flat-square)](.)
[![Latest](https://img.shields.io/badge/Latest-Session%20${latest.n}%20${encodeURIComponent(latest.name)}-blue?style=flat-square)](.)
[![Updated](https://img.shields.io/badge/Updated-${now}-lightgray?style=flat-square)](.)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](./LICENSE)

<br/>

> *A complete progressive backend learning journey — ${total} sessions, each building on the last.*

</div>

---

## 📊 Progress

\`\`\`
Sessions completed  ${progressBar(done.length, total)}  ${done.length} / ${total}  (${pct}%)
\`\`\`

---

## 🗺️ Roadmap

${buildRoadmap(done, todo, total)}

---

## ⚡ Quick Start

\`\`\`bash
cd ${latest.folder}
npm install
cp .env.example .env
npm run dev
\`\`\`

---

## 👤 Author

**Abderrahmane Loukrati** — Software Engineering Student

---

<div align="center">
<sub>Auto-generated ${now} · ${done.length}/${total} sessions · next: ${nextUp ? nextUp.n + ' ' + nextUp.name : 'all done!'} 🚀</sub>
</div>
`
}

// ─── 8. Main ─────────────────────────────────────────────────────────────────
const done   = detectSessions()
const todo   = getUpcoming(done)
const readme = buildReadme(done, todo)

fs.writeFileSync(path.join(ROOT, 'README.md'), readme, 'utf8')

console.log('\n✅  README.md generated automatically\n')
console.log(`   Detected sessions : ${done.length}`)
done.forEach(s => console.log(`     ${s.n}  ${s.name.padEnd(25)}  [${s.tags.join(', ')}]`))
console.log(`\n   Upcoming          : ${todo.length}`)
console.log(`   Next              : ${todo[0] ? todo[0].n + ' — ' + todo[0].name : 'all done!'}`)
console.log()