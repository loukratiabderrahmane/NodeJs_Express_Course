const authModel = require('../model/authModel');
require('dotenv').config();


const handleLougout = async (req, res, next) => {
    try {
        const cookies = req.cookies

        if (!cookies?.jwt) {
            return res.status(401).json({ 'message': 'No refresh token found' })
        }

        const refreshToken = cookies.jwt

        // Récupérer l'utilisateur avec le refresh token
        const foundUser = await authModel.getUserByRefreshToken(refreshToken);

        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true })
            return res.status(401).json({ 'message': 'Invalid refresh token' })
        }

        // Supprimer le refresh token de la base de données
        await authModel.deleteRefreshToken(foundUser.id);

        res.clearCookie('jwt', { httpOnly: true }) // secure: true -only serve in https (on production)
        res.status(200).json({ 'message': 'Logged out successfully' })
    } catch (err) {
        next(err);
    }
}

module.exports = { handleLougout }