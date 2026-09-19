const { Router } = require("express");
const blogController = require("../controllers/blogController.js");
const verifyToken = require('../lib/verifyToken.js')

const clientBlogRouter = Router();

clientBlogRouter.get("/", verifyToken, blogController.getBlogs);

clientBlogRouter.get("/:blogId", verifyToken, blogController.getBlogById);

clientBlogRouter.get("/:blogId/comments", verifyToken, blogController.getBlogComments);
clientBlogRouter.put("/:blogId/comments/:commentId", verifyToken, blogController.updateBlogComment );
clientBlogRouter.post("/:blogId/comments", verifyToken, blogController.postBlogComment);
clientBlogRouter.delete("/:blogId/comments/:commentId", verifyToken, blogController.deleteBlogComment);

module.exports = clientBlogRouter;
