const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) {
            console.log("Failed Admin Auth")
            return res.status(403).json({ error: 'Authentication failed' });
        }
        
        if (req.user.isAdmin) {
            console.log("Passed")
            return next();
        } else {
            console.log('hey')
            return res.status(403).json({ error: 'User is not an Admin' });
        }
    });
}

module.exports = verifyAdmin;