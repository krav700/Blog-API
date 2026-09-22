const { Router } = require("express");
const authController = require("../controllers/authController.js");
const verifyToken = require("../lib/verifyToken.js");

const authRouter = Router();

authRouter.get("/me", verifyToken, authController.getCurrentUser);

authRouter.post("/login", authController.loginUser);
authRouter.get("/login", authController.getLoginForm);

authRouter.post("/register", authController.registerUser);
authRouter.get("/register", authController.getRegisterForm);

authRouter.post("/logout", authController.logoutUser);

module.exports = authRouter;
