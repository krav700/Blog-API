const { Router } = require("express");
const adminController = require("../controllers/adminController.js");
const checkLogin = require("../lib/checkLogin.js")
const verifyToken = require('../lib/verifyToken.js')
const verifyAdmin = require('../lib/verifyAdmin.js')

const adminRouter = Router();

adminRouter.get("/users", verifyToken, verifyAdmin, adminController.getAllUsers );
adminRouter.get("/users/pages/:pageNum", verifyToken, verifyAdmin, adminController.getUsersByPage );
adminRouter.delete("/users/:userId", verifyToken, verifyAdmin, adminController.getUserById);

adminRouter.get("/blogs", verifyToken, verifyAdmin, adminController.getBlogs );
adminRouter.get("/blogs/pages/:pageNum", verifyToken, verifyAdmin, adminController.getBlogsByPage );

adminRouter.get("/blogs/:blogId", verifyToken, verifyAdmin, adminController.getBlogById);
adminRouter.post("/blogs", verifyToken, verifyAdmin, adminController.postBlogById);
adminRouter.put("/blogs/:blogId", verifyToken, verifyAdmin, adminController.updateBlogById);
adminRouter.delete("/blogs/:blogId", verifyToken, verifyAdmin, adminController.deleteBlogById);

adminRouter.get("/blogs/:blogId/comments/page/:pageNum", verifyToken, verifyAdmin, adminController.getCommentsByPage);
adminRouter.delete("/blogs/:blogId/comments/:commentId", verifyToken, verifyAdmin, adminController.deleteCommentById);

module.exports = adminRouter;
