/*
    app.get('asdasd', verifyToken, (req, res) => {
        jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData));
        if (err) {
            return res.sendStatus(403);
        } else {
            return res.json({
                message: 'Post created...',
                authData
            })
        }
    })


*/

function verifyToken(req, res, next) {
    console.log(req.headers)
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        return next();
    } else {
        return res.sendStatus(403);
    }
}

module.exports = verifyToken;