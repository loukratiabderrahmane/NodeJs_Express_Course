const usersDB = {
    users: require('../model/users.json'),
}
const bcrypt = require('bcrypt')

const handleAuth = async (req, res) => {
    const { user, pwd } = req.body
    console.log(req.body)
    console.log(user, pwd)
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required !' })
    const UserFound = usersDB.users.find(person => person.username === user)
    if (!UserFound) return res.status(404).json('User not Found !');
    const match = await bcrypt.compare(pwd, UserFound.pwd)
    if (!match) return res.status(401).json({ message: 'Username or Password not  correct !' })
    res.json({
        message: `${user} Logged in Succssecfully`
    })
}

module.exports = { handleAuth }