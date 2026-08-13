const { Router } = require("express");
const indexController = require("../controllers/indexController.js");
const checkLogin = require("../lib/checkLogin.js")
const verifyToken = require('../lib/verifyToken.js');
const authRouter = require("./authRouter.js")
const blogRouter = require("./blogRouter.js");
const adminRouter = require("./adminRouter.js");
const jwt = require("jsonwebtoken")

const indexRouter = Router();

indexRouter.get("/", verifyToken, (req, res, next) => { 
    // return res.json({
    //         message: 'Home Page',
    // })
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {

        if (err) {
            console.log("Failed Auth")
            return res.sendStatus(403);
        } else {
            return res.json({
                message: 'Home Page',
                authData
            })
        }
    });
});

indexRouter.use("/auth", authRouter);
indexRouter.use("/blogs", blogRouter);
indexRouter.use("/admin", adminRouter);

// indexRouter.get("/sort/:orderBy", checkLogin, indexController.getHomePage);

module.exports = indexRouter;
