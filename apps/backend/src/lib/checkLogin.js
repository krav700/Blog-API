function checkLogin(req, res, next) {
    if (!req.user) {
        return res.redirect("/auth/login");
    }
    res.locals.user = req.user;
    return next();
}

module.exports = checkLogin;