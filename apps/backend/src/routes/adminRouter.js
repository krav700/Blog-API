const { Router } = require("express");
const adminController = require("../controllers/adminController.js");
const checkLogin = require("../lib/checkLogin.js")
const verifyToken = require('../lib/verifyToken.js')
const verifyAdmin = require('../lib/verifyAdmin.js')

const adminRouter = Router();

adminRouter.get("/", verifyToken, verifyAdmin, adminController.getHomePage);

adminRouter.get("/users", verifyToken, verifyAdmin, adminController.getUsers );
adminRouter.delete("/users/:userId", verifyToken, verifyAdmin, adminController.getUserById);

adminRouter.get("/blogs/:blogId", verifyToken, verifyAdmin, adminController.getBlogById);
adminRouter.post("/blogs/:blogId", verifyToken, verifyAdmin, adminController.postBlogById);
adminRouter.put("/blogs/:blogId", verifyToken, verifyAdmin, adminController.updateBlogById);
adminRouter.delete("/blogs/:blogId", verifyToken, verifyAdmin, adminController.deleteBlogById);

adminRouter.delete("/blogs/:blogId/comments/:commentId", verifyToken, verifyAdmin, adminController.deleteCommentById);

module.exports = adminRouter;
