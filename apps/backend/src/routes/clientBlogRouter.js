const { Router } = require("express");
const blogController = require("../controllers/blogController.js");
const verifyToken = require("../lib/verifyToken.js");

const clientBlogRouter = Router();

clientBlogRouter.get("/", blogController.getBlogs);

clientBlogRouter.get("/:blogId", blogController.getBlogById);

clientBlogRouter.get("/:blogId/comments", blogController.getBlogComments);
clientBlogRouter.put(
    "/:blogId/comments/:commentId",
    blogController.updateBlogComment,
);
clientBlogRouter.post(
    "/:blogId/comments",
    verifyToken,
    blogController.postBlogComment,
);
clientBlogRouter.delete(
    "/:blogId/comments/:commentId",
    verifyToken,
    blogController.deleteBlogComment,
);

module.exports = clientBlogRouter;
