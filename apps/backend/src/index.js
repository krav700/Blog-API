require("dotenv").config();
const session = require("express-session");
const express = require("express");
const passport = require("passport");
const path = require("node:path");
const app = express();
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("./lib/prisma.js");
const indexRouter = require("./routes/indexRouter.js");

const cors = require("cors");

require("./config/passport.js");

const assetsPath = path.join(__dirname, "public");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));
app.use(cors());

app.use(
    session({
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", (error) => {
    if (error) {
        throw error;
    }
    console.log(`Blog API - listening on port ${PORT}!`);
});
