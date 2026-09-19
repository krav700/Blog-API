const { Router } = require("express");
const verifyToken = require("../lib/verifyToken.js");
const authRouter = require("./authRouter.js");
const clientBlogRouter = require("./clientBlogRouter.js");
const adminRouter = require("./adminRouter.js");
const verifyAdmin = require("../lib/verifyAdmin.js");

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/blogs", clientBlogRouter);
indexRouter.use("/admin", verifyToken, verifyAdmin, adminRouter);

module.exports = indexRouter;
