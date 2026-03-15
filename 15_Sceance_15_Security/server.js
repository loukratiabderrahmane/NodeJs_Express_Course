const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const { logger } = require('./middleware/logEvents')
const { errorHandler } = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')
const { authLimiter, apiLimiter } = require('./config/rateLimitConfig')
const verifyJWT = require('./middleware/verifyJWT')
const db = require('./config/db')

const PORT = process.env.PORT || 3500

// -------------------------------------------------------
// 1. Helmet — sécurité headers (TOUJOURS EN PREMIER)
// -------------------------------------------------------
app.use(helmet())

// -------------------------------------------------------
// 2. Logger custom
// -------------------------------------------------------
app.use(logger)

// -------------------------------------------------------
// 3. CORS
// -------------------------------------------------------
app.use(cors(corsOptions))

// -------------------------------------------------------
// 4. Body parsers
// -------------------------------------------------------
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// -------------------------------------------------------
// 5. Cookie parser
// -------------------------------------------------------
app.use(cookieParser())

// -------------------------------------------------------
// 6. Fichiers statiques
// -------------------------------------------------------
app.use('/', express.static(path.join(__dirname, '/public')))

// -------------------------------------------------------
// 7. Test DB
// -------------------------------------------------------
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT NOW() AS time')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ message: 'DB error' })
    }
})

// -------------------------------------------------------
// 8. Routes publiques (avec rate limiting sur auth)
// -------------------------------------------------------
app.use('/', require('./routes/root'))
app.use('/register', authLimiter, require('./routes/register'))
app.use('/auth', authLimiter, require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/lougout'))

// -------------------------------------------------------
// 9. Routes protégées (JWT requis + rate limiting API)
// -------------------------------------------------------
app.use(verifyJWT)
app.use('/employees', apiLimiter, require('./routes/api/employees'))

// -------------------------------------------------------
// 10. Handler 404
// -------------------------------------------------------
app.all(/.*/, (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// -------------------------------------------------------
// 11. Error handler (TOUJOURS EN DERNIER)
// -------------------------------------------------------
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
