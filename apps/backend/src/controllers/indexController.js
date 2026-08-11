const { body, validationResult, matchedData } = require("express-validator");
const passwordUtils = require("../lib/passwordUtils.js");
const { prisma } = require("../lib/prisma.js");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const verifyToken = require('../lib/verifyToken.js')

function getHomePage(req, res, next) {

}

module.exports = getHomePage;