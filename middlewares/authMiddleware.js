const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.body.token;
    // console.log({token:token})
    if (!token) {
      return res.send({success : false , Error : "Not authorized, please login"});
    }
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified.id) {
      return res.send({success : false , msg : "id not found"});
    }
    req.body.id = verified.id;
    next();
  } catch (error) {
    return res.send({success : false , msg : "Not authorized, please login dj"});
  }
});

module.exports = protect;
