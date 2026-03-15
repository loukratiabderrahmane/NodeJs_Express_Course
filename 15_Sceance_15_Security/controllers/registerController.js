const usersModel = require('../model/usersModel')

const handleNewUser = async (req, res, next) => {
    const { user, pwd } = req.body
    if (!user || !pwd) {
        return res.status(400).json({ message: 'Username and password are required!' })
    }

    try {
        const userExists = await usersModel.checkUserExists(user)
        if (userExists) return res.sendStatus(409)

        const result = await usersModel.createNewUser(user, pwd)

        return res.status(201).json({
            success: `New user ${user} created successfully!`,
            userId: result.userId
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { handleNewUser }
