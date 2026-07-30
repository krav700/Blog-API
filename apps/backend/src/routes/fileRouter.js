const { Router } = require("express");
const fileController = require("../controllers/fileController.js");
const passport = require("passport");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage()});
const uploadMiddleware = upload.array("file");
const checkLogin = require("../lib/checkLogin.js")

const fileRouter = Router({ mergeParams: true });

fileRouter.get("/create", checkLogin, fileController.getFileCreateForm);
fileRouter.post("/create", uploadMiddleware, fileController.uploadFile);

fileRouter.get("/:fileId", checkLogin, fileController.downloadFile);

fileRouter.get("/:fileId/edit", checkLogin, fileController.getFileEditForm);
fileRouter.post("/:fileId/edit", checkLogin, fileController.editFile);

module.exports = fileRouter;
