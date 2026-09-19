function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader;
        return next();
    } else {
        return res.sendStatus(403).json({ error: 'Invalid token'});
    }
}

module.exports = verifyToken;