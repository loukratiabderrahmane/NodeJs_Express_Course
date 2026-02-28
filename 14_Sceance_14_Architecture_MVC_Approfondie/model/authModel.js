const db = require('../config/db');

// Récupérer l'utilisateur par refresh token
const getUserByRefreshToken = async (refreshToken) => {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE refresh_token = ?',
        [refreshToken]
    );
    return rows[0];
};

// Sauvegarder le refresh token
const saveRefreshToken = async (refreshToken, userId) => {
    await db.query(
        'UPDATE users SET refresh_token = ? WHERE id = ?',
        [refreshToken, userId]
    );
};

// Supprimer le refresh token (logout)
const deleteRefreshToken = async (userId) => {
    await db.query(
        'UPDATE users SET refresh_token = ? WHERE id = ?',
        [null, userId]
    );
};

module.exports = {
    getUserByRefreshToken,
    saveRefreshToken,
    deleteRefreshToken
};
