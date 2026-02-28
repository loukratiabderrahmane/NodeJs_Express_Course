const db = require('../config/db');
const bcrypt = require('bcrypt');

const DEFAULT_ROLE_ID = 2001;

const getUser = async (username) => {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ? LIMIT 1',
        [username]
    );

    return rows[0]
}
const checkUserExists = async (username) => {
    const [existingUsers] = await db.query(
        'SELECT id FROM users WHERE username = ? LIMIT 1',
        [username]
    );
    return existingUsers.length > 0;
};


const createNewUser = async (username, password) => {
    let connection;
    try {
        const hashedPwd = await bcrypt.hash(password, 10);

        connection = await db.getConnection();
        await connection.beginTransaction();

        const [newUser] = await connection.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPwd]
        );

        await connection.query(
            'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
            [newUser.insertId, DEFAULT_ROLE_ID]
        );

        await connection.commit();

        return { success: true, userId: newUser.insertId };
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
};

const getUserRole = async (id) => {
    const [rolesRows] = await db.query(
        'SELECT role_id FROM user_roles WHERE user_id = ?',
        [id]
    )

    return rolesRows.map(r => r.role_id)
}

module.exports = {
    getUser,
    checkUserExists,
    createNewUser,
    getUserRole
};
