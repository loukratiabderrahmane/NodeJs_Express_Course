# 🔐 RBAC (Role-Based Access Control) with Express & JWT -Sceance 12

---

# 1️⃣ What is RBAC?

RBAC = Role-Based Access Control

It is a security system where:

- Authentication → verifies WHO the user is
- Authorization → verifies WHAT the user can do

Example:

| User   | Role   | Can Delete Employee? |
| ------ | ------ | -------------------- |
| Ahmed  | User   | ❌ No                |
| Karim  | Editor | ❌ No                |
| Admin1 | Admin  | ✅ Yes               |

Authentication = identity  
Authorization = permissions

---

# 2️⃣ Why Use RBAC?

Without RBAC:

- Any authenticated user could access everything.

With RBAC:

- Each user only accesses what they are allowed to.

RBAC makes your backend:

- More secure
- More scalable
- Production ready

---

# 3️⃣ Step-by-Step RBAC Implementation

---

## Step 1: Define Roles

Create roles_list.js

```js
const ROLES_LIST = {
  Admin: 5150,
  Editor: 1984,
  User: 2001,
};

module.exports = ROLES_LIST;
```

Why numbers?

- Faster comparisons
- Cleaner storage
- More professional

---

## Step 2: Store Roles in Database

Example users.json:

```json
{
  "username": "Abdo",
  "roles": {
    "Admin": 5150,
    "Editor": 1984,
    "User": 2001
  },
  "pwd": "hashed_password"
}
```

Each user has a roles object.

---

## Step 3: Include Roles in JWT During Login

Inside authController.js:

```js
const roles = Object.values(user.roles);

const accessToken = jwt.sign(
  {
    UserInfo: {
      username: user.username,
      roles: roles,
    },
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "30s" },
);
```

Now the token contains:

UserInfo → username + roles array

---

## Step 4: verifyJWT Middleware (Authentication)

```js
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};
```

Responsibilities:

- Verify token
- Extract username
- Extract roles
- Attach them to request

---

## Step 5: verifyRoles Middleware (Authorization)

```js
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);

    const hasRole = req.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) return res.sendStatus(403);

    next();
  };
};

module.exports = verifyRoles;
```

What it does:

- Receives allowed roles
- Checks if user has at least one
- Blocks if not allowed

---

## Step 6: Protect Routes

Example:

```js
router.post(
  "/",
  verifyJWT,
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
  createNewEmployee,
);

router.delete("/", verifyJWT, verifyRoles(ROLES_LIST.Admin), deleteEmployee);
```

Access Control Table:

| Route  | Required Role   |
| ------ | --------------- |
| GET    | Any logged user |
| POST   | Admin or Editor |
| PUT    | Admin or Editor |
| DELETE | Admin only      |

---

# 4️⃣ Complete RBAC Flow

1. User logs in
2. JWT created with roles
3. User sends request
4. verifyJWT checks token
5. verifyRoles checks permissions
6. Controller executes

---

# 5️⃣ HTTP Status Codes

| Code | Meaning                          |
| ---- | -------------------------------- |
| 401  | Not authenticated                |
| 403  | Authenticated but not authorized |

---

# 6️⃣ Best Practices

- Always separate Authentication and Authorization
- Use 401 for missing token
- Use 403 for insufficient permissions
- Never store sensitive data in JWT
- Always test with multiple user roles
- Keep roles centralized in one file

---

# 7️⃣ What You Built

With this RBAC system, you implemented:

- JWT Authentication
- Role-Based Authorization
- Middleware Architecture
- Protected Routes
- Secure Backend Design

This is intermediate-to-advanced backend architecture.

---

# 8️⃣ Final Concept Summary

Authentication = "Who are you?"  
Authorization = "What can you do?"

RBAC ensures that users only access what their role allows.

---

End of Guide.
