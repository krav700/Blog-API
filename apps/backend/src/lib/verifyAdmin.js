function verifyAdmin(req, res, next) {

    // if (req.user.admin) {
    //     return next();
    // } else {
    //     return res.sendStatus(403);
    // }
    return next()
}

module.exports = verifyAdmin;