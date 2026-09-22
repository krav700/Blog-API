const { Router } = require("express");
const blogController = require("../controllers/blogController.js");

const clientBlogRouter = Router();

clientBlogRouter.get("/", blogController.getBlogs);

clientBlogRouter.get("/:blogId", blogController.getBlogById);

clientBlogRouter.get("/:blogId/comments", blogController.getBlogComments);
clientBlogRouter.put("/:blogId/comments/:commentId", blogController.updateBlogComment );
clientBlogRouter.post("/:blogId/comments", blogController.postBlogComment);
clientBlogRouter.delete("/:blogId/comments/:commentId", blogController.deleteBlogComment);

module.exports = clientBlogRouter;
