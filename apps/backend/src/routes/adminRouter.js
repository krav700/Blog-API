const { Router } = require("express");
const adminController = require("../controllers/adminController.js");
const checkLogin = require("../lib/checkLogin.js")
const verifyToken = require('../lib/verifyToken.js')
const verifyAdmin = require('../lib/verifyAdmin.js')

const adminRouter = Router();

adminRouter.get("/", verifyToken, (req, res, next) => { return res.json({message: "blogs router"}) });
adminRouter.post("/blog", verifyToken, verifyAdmin, (req, res, next) => { return res.json({message: "blogs router"}) });

module.exports = adminRouter;
