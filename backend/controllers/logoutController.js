
const Patients = require('../models/Patients');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await Patients.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: true });
        return res.sendStatus(204); 
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();

    // Delete refreshToken in db
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }