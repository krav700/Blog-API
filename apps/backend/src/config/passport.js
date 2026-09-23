const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { prisma } = require("../lib/prisma");
const { validPassword } = require("../lib/passwordUtils");

const customFields = {
    usernameField: "username",
    passwordField: "password",
};

const verifyCallback = async (username, password, done) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });

        if (!user) {
            console.log("no user");
            return done(null, false, {
                error: "Incorrect username or password",
            });
        }

        const isValid = validPassword(
            password,
            user.hash,
            user.salt,
            user.iterationCount,
        );

        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err);
    }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
});
