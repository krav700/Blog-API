const { Router } = require("express");
const indexController = require("../controllers/indexController.js");
const checkLogin = require("../lib/checkLogin.js")
const authRouter = require("./authRouter.js")
const verifyToken = require('../lib/verifyToken.js');
const blogRouter = require("./blogRouter.js");

const indexRouter = Router();

indexRouter.get("/", verifyToken, (req, res, next) => { console.log("YO"); return res.json({message: "hello"}) });

indexRouter.use("/auth", authRouter);
indexRouter.use("/blogs", blogRouter);

// indexRouter.get("/sort/:orderBy", checkLogin, indexController.getHomePage);

module.exports = indexRouter;
