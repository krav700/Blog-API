const { Router } = require("express");
const verifyToken = require('../lib/verifyToken.js');
const authRouter = require("./authRouter.js")
const clientBlogRouter = require("./clientBlogRouter.js");
const adminRouter = require("./adminRouter.js");
const jwt = require("jsonwebtoken");
const verifyAdmin = require("../lib/verifyAdmin.js");

const indexRouter = Router();

indexRouter.get("/", verifyToken, (req, res, next) => { 
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) {
            console.log("Failed Auth")
            return res.sendStatus(403);
        } else {
            return res.json({ message: 'JWT verified' })
        }
    });
});

indexRouter.use("/auth", authRouter);
indexRouter.use("/blogs", clientBlogRouter);
indexRouter.use("/admin", verifyToken, verifyAdmin, adminRouter);

module.exports = indexRouter;
