const { Router } = require("express");
const indexController = require("../controllers/indexController.js");
const checkLogin = require("../lib/checkLogin.js")

const indexRouter = Router();

indexRouter.get("/", checkLogin, indexController.getHomePage);
indexRouter.get("/sort/:orderBy", checkLogin, indexController.getHomePage);

module.exports = indexRouter;
