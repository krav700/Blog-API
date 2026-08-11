const { Router } = require("express");
const blogController = require("../controllers/indexController.js");
const checkLogin = require("../lib/checkLogin.js")
const verifyToken = require('../lib/verifyToken.js')

const blogRouter = Router();

blogRouter.get("/", verifyToken, (req, res, next) => { return res.json({message: "blogs router"}) });

module.exports = blogRouter;
