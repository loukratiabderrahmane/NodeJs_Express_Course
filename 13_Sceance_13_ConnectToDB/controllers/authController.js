const db = require('../config/db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();



const handleAuth = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required !' })
    const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        user
    );
    const UserFound = rows[0];

    if (UserFound.length == 0) return res.status(404).json('User not Found !');
    const match = await bcrypt.compare(pwd, UserFound.password)
    if (match) {
        const [rolesRows] = await db.query(
            'SELECT role_id FROM user_roles WHERE user_id = ?',
            [UserFound.id]
        )
        const roles = rolesRows.map(r => r.role_id);

        // Create Jwts 
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    'username': UserFound.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10m' }
        )
        const refreshToken = jwt.sign(
            { 'username': UserFound.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        // Save Refresh Token with CURRENT user
        await db.query(
            'UPDATE users SET refresh_token = ? WHERE id = ? ',
            [refreshToken, UserFound.id]
        )


res.cookie('jwt', refreshToken, { httpOnly: true,maxAge: 24 * 60 * 60 * 1000 })
res.json({ accessToken })
    } else {
    res.status(401).json({ message: 'Username or Password not  correct !' })
}

}

module.exports = { handleAuth }