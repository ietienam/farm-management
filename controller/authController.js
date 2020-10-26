"use strict";

var { promisify } = require("util"); //CONVERT FUNCTION TO ASYNC TO AWAIT A PROMISE
var jwt = require("jsonwebtoken");
var AppError = require("../utils/appError");
var catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  //GETTING TOKEN AND CHECK IF ITS THERE
  let token;

  if (req.headers.authorization && req.headers.authorization !== "") {
    token = req.headers.authorization;
  }

  if (!token) {
    return next(new AppError("Access denied! Please logIn", 401));
  } else {
    //VERIFY TOKEN
    const decoded = await promisify(jwt.verify)(token, 'mysecret');
    console.log(decoded);

    if (decoded.id) {
      next();
    } else {
      return next(new AppError('Token not valid. Please login!', 400));
    }
  }
});
