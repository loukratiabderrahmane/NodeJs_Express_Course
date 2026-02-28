const db = require('../config/db');

const jwt = require('jsonwebtoken')
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    console.log(cookies)
    
    if (!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt

    const [rows] = await db.query(
        'SELECT * FROM users WHERE refresh_token = ?',
        refreshToken
    );
    if (rows.length == 0) return res.sendStatus(403); //Forbidden
    const UserFound = rows[0];
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async(err, decoded) => {
            if (err || UserFound.username !== decoded.username) return res.sendStatus(403)
            const [rolesRows] = await db.query(
                'SELECT role_id FROM user_roles WHERE user_id = ?',
                [UserFound.id]
            )
            const roles = rolesRows.map(r => r.role_id);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        'username': UserFound.username,
                        "roles": roles
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            )
            res.json({ accessToken })
        }
    )


}

module.exports = { handleRefreshToken }