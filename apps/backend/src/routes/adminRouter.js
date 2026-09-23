const { Router } = require("express");
const adminController = require("../controllers/adminController.js");

const adminRouter = Router();

adminRouter.get("/users", adminController.getAllUsers);
adminRouter.get("/users/pages/:pageNum", adminController.getUsersByPage);
adminRouter.put("/users/:userId", adminController.updateUser);
adminRouter.delete("/users/:userId", adminController.deleteUser);

adminRouter.get("/blogs", adminController.getBlogs);
adminRouter.get("/blogs/pages/:pageNum", adminController.getBlogsByPage);

adminRouter.get("/blogs/:blogId", adminController.getBlogById);
adminRouter.post("/blogs", adminController.postBlogById);
adminRouter.put("/blogs/:blogId", adminController.updateBlogById);
adminRouter.delete("/blogs/:blogId", adminController.deleteBlogById);

adminRouter.get(
    "/blogs/:blogId/comments/page/:pageNum",
    adminController.getCommentsByPage,
);
adminRouter.delete(
    "/blogs/:blogId/comments/:commentId",
    adminController.deleteCommentById,
);

module.exports = adminRouter;
