require("dotenv").config();
const session = require("express-session");
const express = require("express");
const passport = require("passport");
const path = require("node:path");
const app = express();
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const { PrismaClient } = require('@prisma/client')
const { prisma } = require('./lib/prisma.js')
const indexRouter = require("./routes/indexRouter.js");
const folderRouter = require("./routes/folderRouter.js");
const authRouter = require("./routes/authRouter.js");
const formatBytes = require("./lib/formBytes.js")
require("./config/passport.js");

const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));
app.use("/uploads", express.static("uploads"));
app.locals.formatBytes = formatBytes;

app.use(
    session({
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 2 * 60 * 1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        ),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/folder", folderRouter);
app.use("/auth", authRouter);

const PORT = 3000;
app.listen(process.env.PORT ?? PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`File Upload - listening on port ${PORT}!`);
});

app.use((err, req, res, next) => {
    console.error(err);

    const status = Number(err.statusCode || err.status || 500);

    res.status(status).render("errorPages/errorPage", {
        errorMessage: err.message,
    });
});

app.use((req, res) => {
    res.status(404).render("errorPages/404", {
        title: "404",
        pageURL: req.path,
    });
});
