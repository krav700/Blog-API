const { Router } = require("express");
const adminController = require("../controllers/adminController.js");
const checkLogin = require("../lib/checkLogin.js")
const verifyToken = require('../lib/verifyToken.js')
const verifyAdmin = require('../lib/verifyAdmin.js')

const adminRouter = Router();

adminRouter.get("/", verifyToken, verifyAdmin, (req, res, next) => { return res.json({message: "admin panel"}) });

adminRouter.get("/users", verifyToken, verifyAdmin, (req, res, next) => { return res.json({message: "get users"}) });
adminRouter.delete("/users/:userId", verifyToken, verifyAdmin, (req, res, next) => { return res.json({message: "delete user"}) });

adminRouter.get("/blogs/:blogId", verifyToken, verifyAdmin, (req, res, next) => { return res.json({message: "get blog"}) });
adminRouter.post("/blogs/:blogId", verifyToken, verifyAdmin, (req, res, next) => { return res.json({message: "edit blog"}) });
adminRouter.put("/blogs/:blogId", verifyToken, verifyAdmin, (req, res, next) => { return res.json({message: "edit blog"}) });
adminRouter.delete("/blogs/:blogId", verifyToken, verifyAdmin, (req, res, next) => { return res.json({message: "delete blog"}) });

adminRouter.delete("/blogs/:blogId/comments/:commentId", verifyToken, verifyAdmin, (req, res, next) => { return res.json({message: "delete comment"}) });

module.exports = adminRouter;
