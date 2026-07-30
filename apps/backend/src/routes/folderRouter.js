const { Router } = require("express");
const folderController = require("../controllers/folderController.js");
const passport = require("passport");
const multer = require("multer");
const fileRouter = require("./fileRouter.js");
const upload = multer({ dest: "uploads/" });
const uploadMiddleware = upload.array("file");
const checkLogin = require("../lib/checkLogin.js")

const folderRouter = Router();


folderRouter.get("/create", checkLogin, folderController.getFolderCreateForm);
folderRouter.post("/create", checkLogin, folderController.createFolder);
folderRouter.get("/:folderId/create", checkLogin, folderController.getFolderCreateForm);
folderRouter.post("/:folderId/create", checkLogin, folderController.createFolder)
folderRouter.get("/:folderId/edit", checkLogin, folderController.getFolderEditForm);
folderRouter.post("/:folderId/edit", checkLogin, folderController.editFolder)

folderRouter.get("/:folderId/share", checkLogin, folderController.shareFolder)
folderRouter.get("/share/:shareToken", checkLogin, folderController.getSharedFolderFiles)
folderRouter.get("/share/:shareToken/sort/:orderBy", checkLogin, folderController.getSharedFolderFiles)

folderRouter.use("/:folderId/file", fileRouter);

folderRouter.get("/:folderId", checkLogin, folderController.getFolderFiles);
folderRouter.get("/:folderId/sort/:orderBy", checkLogin, folderController.getFolderFiles);


module.exports = folderRouter;
