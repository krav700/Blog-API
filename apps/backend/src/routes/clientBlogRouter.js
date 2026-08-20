const { Router } = require("express");
const blogController = require("../controllers/blogController.js");
const checkLogin = require("../lib/checkLogin.js")
const verifyToken = require('../lib/verifyToken.js')

const clientBlogRouter = Router();

clientBlogRouter.get("/", verifyToken, (req, res, next) => { return res.json({message: "get blogs"}) });

clientBlogRouter.get("/:blogId", verifyToken, (req, res, next) => { return res.json({message: "get one blog"}) });

clientBlogRouter.get("/:blogId/comments", verifyToken, (req, res, next) => { return res.json({message: "get comments"}) });
clientBlogRouter.put("/:blogId/comments/:commentId", verifyToken, (req, res, next) => { return res.json({message: "edit your comment"}) });
clientBlogRouter.post("/:blogId/comments/:commentId", verifyToken, (req, res, next) => { return res.json({message: "post a comment"}) });
clientBlogRouter.delete("/:blogId/comments/:commentId", verifyToken, (req, res, next) => { return res.json({message: "delete your comment"}) });

module.exports = clientBlogRouter;
