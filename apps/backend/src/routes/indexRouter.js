const { Router } = require("express");
const indexController = require("../controllers/indexController.js");
const checkLogin = require("../lib/checkLogin.js")
const authRouter = require("./authRouter.js")

const indexRouter = Router();

indexRouter.get("/", (req, res, next) => { return res.json({message: "hello"}) });

indexRouter.use("/auth", authRouter);

// indexRouter.get("/sort/:orderBy", checkLogin, indexController.getHomePage);

module.exports = indexRouter;
