const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const jwt = require('jsonwebtoken')
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt

    const UserFound = usersDB.users.find(person => person.refreshToken === refreshToken)
    if (!UserFound) return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || UserFound.username !== decoded.username) return res.sendStatus(403)
            const roles = Object.values(UserFound.roles)
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