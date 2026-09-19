const { body, validationResult, matchedData } = require("express-validator");
const passwordUtils = require("../lib/passwordUtils.js");
const { prisma } = require("../lib/prisma.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const emptyErr = "must not be empty.";
const lengthErr = "must be between 3 and 50 characters.";

const validateLogin = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage(`Username ${emptyErr}`)
        .isLength({ min: 3, max: 50 })
        .withMessage(`Username ${lengthErr}`),
    body("password")
        .trim()
        .notEmpty()
        .withMessage(`Password ${emptyErr}`)
        .isLength({ min: 8 })
        .withMessage(`Password should be minimum 8 characters.`),
];

const validateRegister = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage(`First Name ${emptyErr}`)
        .isLength({ min: 3, max: 50 })
        .withMessage(`First Name ${lengthErr}`),
    body("lastName")
        .trim()
        .notEmpty()
        .withMessage(`Last Name ${emptyErr}`)
        .isLength({ min: 3, max: 50 })
        .withMessage(`Last Name ${lengthErr}`),
    body("username")
        .trim()
        .notEmpty()
        .withMessage(`Username ${emptyErr}`)
        .isLength({ min: 3, max: 50 })
        .withMessage(`Username ${lengthErr}`)
        .custom(async (value) => {
            const user = await prisma.user.findFirst({
                where: {
                    username: value,
                },
            });
            if (user) {
                throw new Error();
            }
            return true;
        })
        .withMessage("Username already in use."),
    body("password")
        .trim()
        .notEmpty()
        .withMessage(`Password ${emptyErr}`)
        .isLength({ min: 8 })
        .withMessage(`Password should be minimum 8 characters.`),
    body("confirmPassword")
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage("Confirm Password does not match Password."),
];

function getLoginForm(req, res, next) {
    return res.json({ message: "this is a login form" });
}

const loginUser = [
    validateLogin,
    (req, res, next) => {
        return passport.authenticate("local", function (err, user, info) {
            if (err) {
                console.log(err);
                return next(err);
            }

            if (!user) {
                console.log(info?.message || "Authentication failed");
                return res.json({
                    message: info?.message || "Authentication failed",
                    href: "/auth/login",
                });
            }

            req.login(user, (err) => {
                if (err) {
                    console.log(err);
                    return next(err);
                }

                jwt.sign(
                    {
                        id: user,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                        isAdmin: user.isAdmin
                    },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "2d" },
                    (err, token) => {
                        return res.json({
                            message: "Login successful",
                            token,
                        });
                    },
                );
            });
        })(req, res, next);
    },
];

function getRegisterForm(req, res, next) {
    return res.json({ message: "this is a register form" });
}

const registerUser = [
    validateRegister,
    async (req, res, next) => {
        const { firstName, lastName, email, username, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                title: "Register",
                errors: errors.array(),
                firstName,
                lastName,
                username,
            });
        }

        const saltHash = passwordUtils.genPassword(password);

        const salt = saltHash.salt;
        const hash = saltHash.hash;
        const iterationCount = saltHash.iterationCount;

        try {
            await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    username,
                    hash,
                    salt,
                    iterationCount,
                },
            });

            return res.json({
                message: "Register successful",
                href: "/auth/login",
            });
        } catch (err) {
            next(err);
        }
    },
];

function logoutUser(req, res, next) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
            return next(err);
        }
        return res.json({ message: "User Logged Out", href: "/" });
    });
}

module.exports = {
    getLoginForm,
    loginUser,
    getRegisterForm,
    registerUser,
    logoutUser,
};
