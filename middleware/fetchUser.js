const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Job$finder';

const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        // console.log('Decoded Token Data:', data); // Add this line for debugging
        req.user = data.user;
        // console.log('req.user:', req.user); // Add this line for debugging
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
};

module.exports = fetchUser;
