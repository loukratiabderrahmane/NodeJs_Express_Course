const db = require('../config/db');
const bcrypt = require('bcrypt')


const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required !' })
    // check for duplicates Username
    const [usersDB] = await db.query('SELECT * FROM users');
    const duplicate = usersDB.find(person => person.username === user)
    if (duplicate) return res.sendStatus(409); //Conflict
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10)
        // store new user
        const [newUser] = await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [user, hashedPwd]
        );
        await db.query(
            'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
            [newUser.insertId, 2001]
        )

        res.status(201).json({
            'Succes': `new User ${user} created Succefully !`
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { handleNewUser }