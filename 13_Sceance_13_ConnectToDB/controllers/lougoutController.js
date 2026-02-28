const db = require('../config/db');
require('dotenv').config();


const handleLougout = async (req, res) => {
    const cookies = req.cookies
    console.log(cookies);
    
    if (!cookies?.jwt) return  res.status(401).json({'message': 'No refresh token found'})
    const refreshToken = cookies.jwt

    // Is Refresh Token in db ?
    const [rows] = await db.query(
        'SELECT * FROM users WHERE refresh_token = ?',
        [refreshToken]
    );
    if (rows.length == 0) {
        res.clearCookie('jwt', { httpOnly: true})
        return res.status(401).json({'message': 'Invalid refresh token'})
    }
    const foundUser = rows[0];
    
    // Delete Refresh Token in db
    await db.query(
        'UPDATE users SET refresh_token = ? WHERE id = ?',
        [null, foundUser.id]
    )
    res.clearCookie('jwt', { httpOnly: true}) // secure: true -only serve in https (on production)
    res.status(200).json({'message': 'Logged out successfully'})
    
}

module.exports = { handleLougout }