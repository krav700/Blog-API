const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
    if (req.user?.isAdmin) {
        console.log("Passed");
        return next();
    } else {
        console.log("Did NOT Pass");
        return res.status(403).json({ error: "User is not an Admin" });
    }
}

module.exports = verifyAdmin;
