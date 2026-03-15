const db = require('../config/db')

const getUserByRefreshToken = async (refreshToken) => {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE refresh_token = ?',
        [refreshToken]
    )
    return rows[0]
}

const saveRefreshToken = async (refreshToken, userId) => {
    await db.query(
        'UPDATE users SET refresh_token = ? WHERE id = ?',
        [refreshToken, userId]
    )
}

const deleteRefreshToken = async (userId) => {
    await db.query(
        'UPDATE users SET refresh_token = NULL WHERE id = ?',
        [userId]
    )
}

module.exports = { getUserByRefreshToken, saveRefreshToken, deleteRefreshToken }
