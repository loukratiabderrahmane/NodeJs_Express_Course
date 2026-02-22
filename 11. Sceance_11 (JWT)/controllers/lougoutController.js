const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const jwt = require('jsonwebtoken')
require('dotenv').config();
const fsPromises = require('fs').promises
const path = require('path')

const handleLougout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    refreshToken = cookies.jwt

    // Is Refresh Token in db ?
    const foundUser = usersDB.users.find(u => u.refreshToken === refreshToken)
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        return res.sendStatus(204)
    }

    // Delete Refresh Token in db
    const otherUsers = usersDB.users.filter(u => u.refreshToken !== foundUser.refreshToken)
    const currentUser = { ...foundUser, refreshToken: '' }
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )

    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) // secure: true -only serve in https (on production)
    res.sendStatus(204)
}

module.exports = { handleLougout }