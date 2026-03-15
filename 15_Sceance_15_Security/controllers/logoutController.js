const authModel = require('../model/authModel')
require('dotenv').config()

const handleLogout = async (req, res, next) => {
    try {
        const cookies = req.cookies
        if (!cookies?.jwt) return res.status(401).json({ message: 'No refresh token found' })

        const refreshToken = cookies.jwt
        const foundUser = await authModel.getUserByRefreshToken(refreshToken)

        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true })
            return res.status(401).json({ message: 'Invalid refresh token' })
        }

        await authModel.deleteRefreshToken(foundUser.id)

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        })
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (err) {
        next(err)
    }
}

module.exports = { handleLogout }
