const { Router } = require("express");
const indexController = require("../controllers/indexController.js");
const checkLogin = require("../lib/checkLogin.js")
const verifyToken = require('../lib/verifyToken.js');
const authRouter = require("./authRouter.js")
const clientBlogRouter = require("./clientBlogRouter.js");
const adminRouter = require("./adminRouter.js");
const jwt = require("jsonwebtoken")

const indexRouter = Router();

indexRouter.get("/", verifyToken, (req, res, next) => { 
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) {
            console.log("Failed Auth")
            return res.sendStatus(403);
        } else {
            return res.redirect('blogs')
        }
    });
});

indexRouter.use("/auth", authRouter);
indexRouter.use("/blogs", clientBlogRouter);
indexRouter.use("/admin", adminRouter);

module.exports = indexRouter;
