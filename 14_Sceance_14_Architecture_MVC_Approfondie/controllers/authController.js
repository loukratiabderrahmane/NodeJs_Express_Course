const usersModel = require('../model/usersModel');
const authModel = require('../model/authModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();



const handleAuth = async (req, res, next) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required !' })

    try {
        const UserFound = await usersModel.getUser(user);

        if (!UserFound) return res.status(404).json('User not Found !');
        const match = await bcrypt.compare(pwd, UserFound.password)
        if (match) {
            const roles = await usersModel.getUserRole(UserFound.id);

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
            await authModel.saveRefreshToken(refreshToken, UserFound.id)

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000
            })
            res.json({ accessToken })
        } else {
            res.status(401).json({ message: 'Username or Password not correct !' })
        }
    } catch (err) {
        next(err)
    }
}

module.exports = { handleAuth }