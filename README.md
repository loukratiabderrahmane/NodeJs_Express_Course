<div align="center">

```
███╗   ██╗ ██████╗ ██████╗ ███████╗         ██╗███████╗
████╗  ██║██╔═══██╗██╔══██╗██╔════╝         ██║██╔════╝
██╔██╗ ██║██║   ██║██║  ██║█████╗           ██║███████╗
██║╚██╗██║██║   ██║██║  ██║██╔══╝      ██   ██║╚════██║
██║ ╚████║╚██████╔╝██████╔╝███████╗    ╚█████╔╝███████║
╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝     ╚════╝ ╚══════╝

███████╗██╗  ██╗██████╗ ██████╗ ███████╗███████╗███████╗
██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝
█████╗   ╚███╔╝ ██████╔╝██████╔╝█████╗  ███████╗███████╗
██╔══╝   ██╔██╗ ██╔═══╝ ██╔══██╗██╔══╝  ╚════██║╚════██║
███████╗██╔╝ ██╗██║     ██║  ██║███████╗███████║███████║
╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝
```

**`BACKEND MASTERY JOURNEY`** — *Building production-grade APIs from zero to deployment*

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

![GitHub last commit](https://img.shields.io/github/last-commit/loukratiabderrahmane/NodeJs_Express_Course?style=flat-square&color=00ff88&label=last+commit)
![GitHub repo size](https://img.shields.io/github/repo-size/loukratiabderrahmane/NodeJs_Express_Course?style=flat-square&color=00aaff&label=repo+size)
![Sessions](https://img.shields.io/badge/sessions-15%20%2F%2023-ff6b35?style=flat-square&label=progress)

</div>

---

## ◈ SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   This repository documents a complete backend engineering journey      │
│   using Node.js + Express — from raw fundamentals to production-grade  │
│   architecture with security, authentication, and scalable design.      │
│                                                                         │
│   Each session is a self-contained module that builds on the last.      │
│   The goal: become a backend engineer, not just a tutorial follower.    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ◈ MISSION PROGRESS

<div align="center">

```
COMPLETED   ████████████████████████████████░░░░░░░░░░░░░░   15 / 23  [65%]
```

| PHASE | STATUS | SESSIONS |
|:------|:------:|:--------:|
| 🟢 **Core Foundations** | `COMPLETE` | 01 → 04 |
| 🟢 **Server Architecture** | `COMPLETE` | 05 → 09 |
| 🟢 **Advanced Patterns** | `COMPLETE` | 10 → 13 |
| 🟢 **Security & Auth** | `COMPLETE` | 14 → 15 |
| 🔵 **Data & Validation** | `IN PROGRESS` | 16 → 18 |
| ⚫ **Advanced Features** | `UPCOMING` | 19 → 21 |
| ⚫ **Production Deploy** | `UPCOMING` | 22 → 23 |

</div>

---

## ◈ ARCHITECTURE BLUEPRINT

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT REQUEST                        │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                     server.js  [ENTRY]                       │
│  helmet() → logger → cors → body-parser → cookie-parser      │
│  static files → public routes → verifyJWT → protected routes │
└──────┬────────────────────────────────────────────┬──────────┘
       │                                            │
       ▼                                            ▼
┌──────────────┐                          ┌──────────────────┐
│  PUBLIC API  │                          │  PROTECTED API   │
│              │                          │                  │
│  /register   │◄── rateLimiter(10/15m)   │  /api/employees  │◄── rateLimiter(100/15m)
│  /auth       │                          │  /refresh        │
│  /logout     │                          │  ...             │
└──────┬───────┘                          └────────┬─────────┘
       │                                            │
       ▼                                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                          │
│  authController  │  employeesController  │  registerCtrl    │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                      MODEL LAYER                             │
│  authModel  │  usersModel  │  employeesModel                 │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    MySQL DATABASE                            │
└──────────────────────────────────────────────────────────────┘
```

---

## ◈ SESSION ROADMAP

### ▸ PHASE 1 — CORE FOUNDATIONS `[COMPLETE]`

| # | Session | Key Concepts |
|:-:|:--------|:-------------|
| 01 | **Node.js Modules** | `CommonJS` `require/exports` `fs` `streams` `EventEmitter` |
| 02 | **File System** | `fs.promises` `path` `__dirname` `async/await` |
| 03 | **Fundamentals** | `Node.js internals` `event loop` `non-blocking I/O` |
| 04 | **Log Events** | `custom logger` `log rotation` `error tracking` |

### ▸ PHASE 2 — SERVER ARCHITECTURE `[COMPLETE]`

| # | Session | Key Concepts |
|:-:|:--------|:-------------|
| 05 | **Web Server** | `http module` `request/response cycle` `status codes` |
| 06 | **Intro to Express** | `express()` `middleware chain` `static files` |
| 07 | **Middleware** | `custom middleware` `error handling` `next()` |
| 08 | **Routers** | `express.Router` `route params` `query strings` |
| 09 | **MVC REST API** | `MVC pattern` `REST principles` `CRUD operations` |

### ▸ PHASE 3 — ADVANCED PATTERNS `[COMPLETE]`

| # | Session | Key Concepts |
|:-:|:--------|:-------------|
| 10 | **Authentication** | `JWT` `access tokens` `refresh tokens` `cookie-parser` |
| 11 | **JWT Deep Dive** | `jsonwebtoken` `token verification` `httpOnly cookies` |
| 12 | **RBAC** | `role-based access` `permission middleware` `route guards` |
| 13 | **DB Connection** | `mysql2` `connection pooling` `async queries` |

### ▸ PHASE 4 — SECURITY `[COMPLETE]`

| # | Session | Key Concepts |
|:-:|:--------|:-------------|
| 14 | **Architecture** | `MVC clean separation` `model abstraction` `service layer` |
| 15 | **Security** | `helmet` `CORS` `rate limiting` `secure cookies` `error masking` |

### ▸ PHASE 5 — DATA & VALIDATION `[IN PROGRESS]`

| # | Session | Key Concepts |
|:-:|:--------|:-------------|
| 16 | **Validation** | `Joi` `express-validator` `input sanitization` `schema validation` |
| 17 | **Testing** | `Jest` `Supertest` `unit tests` `integration tests` `mocking` |
| 18 | **Config** | `dotenv` `config management` `environment segregation` |

### ▸ PHASE 6 — ADVANCED FEATURES `[UPCOMING]`

| # | Session | Key Concepts |
|:-:|:--------|:-------------|
| 19 | **ORM** | `Prisma` `schema definitions` `migrations` `seeding` |
| 20 | **File Upload** | `Multer` `file validation` `storage strategies` |
| 21 | **WebSockets** | `Socket.io` `real-time events` `rooms` `namespaces` |

### ▸ PHASE 7 — PRODUCTION `[UPCOMING]`

| # | Session | Key Concepts |
|:-:|:--------|:-------------|
| 22 | **Emails** | `Nodemailer` `SMTP` `templates` `transactional emails` |
| 23 | **Deployment** | `Railway` `CI/CD` `GitHub Actions` `environment variables` |

---

## ◈ SECURITY IMPLEMENTED

```
┌─────────────────────────────────────────────────────────────────┐
│  SECURITY LAYER                              STATUS             │
├─────────────────────────────────────────────────────────────────┤
│  Helmet.js — HTTP security headers           ██████████  100%   │
│  CORS — origin validation                    ██████████  100%   │
│  JWT — stateless authentication              ██████████  100%   │
│  Refresh tokens — rotation strategy          ██████████  100%   │
│  httpOnly cookies — XSS mitigation           ██████████  100%   │
│  Rate limiting — brute force protection      ██████████  100%   │
│  RBAC — role-based access control            ██████████  100%   │
│  Error masking — no stack traces in prod     ██████████  100%   │
│  Input validation — Joi / express-validator  ░░░░░░░░░░    0%   │
│  SQL injection protection — parameterized    ██████████  100%   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ◈ TECH STACK

```
RUNTIME      Node.js 20 LTS
FRAMEWORK    Express 4.x
DATABASE     MySQL + mysql2 driver
AUTH         JWT (jsonwebtoken) + bcrypt
SECURITY     Helmet + cors + express-rate-limit
LOGGING      Custom middleware (logEvents)
TESTING      Jest + Supertest  [COMING S17]
ORM          Prisma            [COMING S19]
DEPLOY       Railway + GitHub Actions
```

---

## ◈ QUICK START

```bash
# Clone the repository
git clone https://github.com/loukratiabderrahmane/NodeJs_Express_Course.git
cd NodeJs_Express_Course

# Navigate to any session
cd 15_Sceance_15_Security

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# → edit .env with your DB credentials and JWT secrets

# Launch
node server.js
```

---

## ◈ PROJECT STRUCTURE

```
NodeJs_Express_Course/
│
├── 01_Sceance_1_Modules/
├── 02_Sceance_2_Files/
├── ...
├── 15_Sceance_15_Security/
│   ├── config/
│   │   ├── corsOptions.js
│   │   ├── db.js
│   │   ├── rateLimitConfig.js
│   │   └── roles_list.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeesController.js
│   │   ├── logoutController.js
│   │   ├── refreshTokenController.js
│   │   └── registerController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── logEvents.js
│   │   ├── verifyJWT.js
│   │   └── verifyRoles.js
│   ├── model/
│   │   ├── authModel.js
│   │   ├── employeesModel.js
│   │   └── usersModel.js
│   ├── routes/
│   ├── .env.example
│   ├── server.js
│   └── Sceance_15_Notes.md
│
├── generate-readme.js        ← auto-updates this README
├── .github/workflows/
│   └── update-readme.yml     ← runs on every push to master
└── README.md
```

---

## ◈ GITHUB STATS

<div align="center">

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=loukratiabderrahmane&show_icons=true&theme=github_dark&hide_border=true&bg_color=0d1117&title_color=00ff88&icon_color=00aaff&text_color=c9d1d9)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=loukratiabderrahmane&layout=compact&theme=github_dark&hide_border=true&bg_color=0d1117&title_color=00ff88&text_color=c9d1d9)

</div>

---

## ◈ ABOUT

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Author    :  Loukrati Abderrahmane                         │
│   Focus     :  Backend Engineering / Node.js / Express       │
│   Goal      :  Production-ready API architecture             │
│   Status    :  Active — new sessions added regularly         │
│                                                              │
│   "I will continue contributing new sessions and             │
│    advanced backend concepts until this course is            │
│    a complete reference for Node.js backend dev."            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

<div align="center">

*README auto-generated by [`generate-readme.js`](generate-readme.js) — updates on every push via GitHub Actions*

**[⬆ Back to top](#)**

</div>