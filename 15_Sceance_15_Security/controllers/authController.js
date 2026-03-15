const usersModel = require('../model/usersModel');
const authModel = require('../model/authModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const handleAuth = async (req, res, next) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required!' })

    try {
        const UserFound = await usersModel.getUser(user)
        if (!UserFound) return res.status(404).json({ message: 'User not found!' })

        const match = await bcrypt.compare(pwd, UserFound.password)
        if (!match) return res.status(401).json({ message: 'Username or password incorrect!' })

        const roles = await usersModel.getUserRole(UserFound.id)

        const accessToken = jwt.sign(
            { UserInfo: { username: UserFound.username, roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10m' }
        )

        const refreshToken = jwt.sign(
            { username: UserFound.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        await authModel.saveRefreshToken(refreshToken, UserFound.id)

        // ✅ Cookie sécurisé — corrigé par rapport aux séances précédentes
        res.cookie('jwt', refreshToken, {
            httpOnly: true,                                      // inaccessible via JS
            secure: process.env.NODE_ENV === 'production',       // HTTPS uniquement en prod
            sameSite: 'Strict',                                  // protection CSRF
            maxAge: 24 * 60 * 60 * 1000                         // 1 jour
        })

        res.json({ accessToken })

    } catch (err) {
        next(err)
    }
}

module.exports = { handleAuth }
