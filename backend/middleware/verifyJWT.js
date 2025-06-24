const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    // console.log(authHeader);
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log('Token:', token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN,
        (err, decoded) => {
            console.log(decoded);
            if (err) return res.sendStatus(403); // Invalid token
            req.user = {
                _id: decoded.UserInfo._id,
                fullName: decoded.UserInfo.fullName,
                email: decoded.UserInfo.email,
                role: decoded.UserInfo.role
            };
            console.log('Decoded UserInfo:', req.user);
            next();
        }
    );


}

module.exports = verifyJWT