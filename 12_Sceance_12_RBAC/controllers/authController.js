const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const fsPromises = require('fs').promises
const path = require('path')


const handleAuth = async (req, res) => {
    const { user, pwd } = req.body
    console.log(req.body)
    console.log(user, pwd)
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required !' })
    const UserFound = usersDB.users.find(person => person.username === user)
    if (!UserFound) return res.status(404).json('User not Found !');
    const match = await bcrypt.compare(pwd, UserFound.pwd)
    if (match) {
        const roles = Object.values(UserFound.roles)
        // Create Jwts 
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    'username': UserFound.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
        )
        const refreshToken = jwt.sign(
            { 'username': UserFound.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        // Save Refresh Token with CURRENT user
        const otherUsers = usersDB.users.filter(u => u.username !== UserFound.username)
        const currentUser = { ...UserFound, refreshToken }
        usersDB.setUsers([...otherUsers, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        res.cookie('jwt', refreshToken, { httponly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ accessToken })
    } else {
        res.status(401).json({ message: 'Username or Password not  correct !' })
    }

}

module.exports = { handleAuth }