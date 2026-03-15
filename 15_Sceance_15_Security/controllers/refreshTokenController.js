const authModel = require('../model/authModel')
const usersModel = require('../model/usersModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const handleRefreshToken = async (req, res, next) => {
    try {
        const cookies = req.cookies
        if (!cookies?.jwt) return res.sendStatus(401)

        const refreshToken = cookies.jwt
        const UserFound = await authModel.getUserByRefreshToken(refreshToken)
        if (!UserFound) return res.sendStatus(403)

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err || UserFound.username !== decoded.username) return res.sendStatus(403)

                const roles = await usersModel.getUserRole(UserFound.id)
                const accessToken = jwt.sign(
                    { UserInfo: { username: UserFound.username, roles } },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '10m' }
                )
                res.json({ accessToken })
            }
        )
    } catch (err) {
        next(err)
    }
}

module.exports = { handleRefreshToken }
