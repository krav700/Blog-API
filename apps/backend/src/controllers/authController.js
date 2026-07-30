const { body, validationResult, matchedData } = require("express-validator");
const passwordUtils = require("../lib/passwordUtils.js");
const { prisma } = require("../lib/prisma.js");
const passport = require("passport");

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
    body("first-name")
        .trim()
        .notEmpty()
        .withMessage(`First Name ${emptyErr}`)
        .isLength({ min: 3, max: 50 })
        .withMessage(`First Name ${lengthErr}`),
    body("last-name")
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
    body("confirm-password")
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage("Confirm Password does not match Password."),
];

function getLoginForm(req, res, next) {
    res.render("forms/login", { title: "Login" });
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
                return res.redirect("/auth/login");
            }

            req.login(user, (err) => {
                if (err) {
                    console.log(err);
                    return next(err);
                }

                return res.redirect("/");
            });
        })(req, res, next);
    },
];

function getRegisterForm(req, res, next) {
    res.render("forms/register", { title: "Register" });
}

const registerUser = [
    validateRegister,
    async (req, res, next) => {
        const {
            "first-name": firstName,
            "last-name": lastName,
            username,
            password,
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("forms/register", {
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
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    hash: hash,
                    salt: salt,
                    iterationCount: iterationCount,
                },
            });

            res.redirect("/auth/login");
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
        res.redirect("/");
    });
}

module.exports = {
    getLoginForm,
    loginUser,
    getRegisterForm,
    registerUser,
    logoutUser,
};
