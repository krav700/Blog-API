const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        req.token = bearerHeader;

        jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
            if (err) {
                console.log("Failed token verification");
                console.log(err);
                return res.status(403).json({ error: "Authentication failed" });
            }
            req.user = authData.id;
        });

        return next();
    } else {
        return res.sendStatus(403).json({ error: "Invalid token" });
    }
}

module.exports = verifyToken;
