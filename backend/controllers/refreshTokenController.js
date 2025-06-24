const Patients = require('../models/Patients'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Extract from cookies

    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token missing" });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const user = await Patients.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Invalidate the current refresh token before generating a new one
    user.refreshToken = null;
    await user.save();

    // Generate new tokens
    const newAccessToken = jwt.sign(
        { UserInfo: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role } },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1d" }
    );
    const newRefreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN,
        { expiresIn: "7d" }
    );

    // Store the new refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Send new refresh token as HTTP-only cookie
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ accessToken: newAccessToken });

} catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
}
};

module.exports = { handleRefreshToken };
