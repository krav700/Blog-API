const { Router } = require("express");
const authController = require("../controllers/authController.js");

const authRouter = Router();

authRouter.post("/login", authController.loginUser);
authRouter.get("/login", authController.getLoginForm);

authRouter.post("/register", authController.registerUser);
authRouter.get("/register", authController.getRegisterForm);

authRouter.post("/logout", authController.logoutUser);

module.exports = authRouter;
