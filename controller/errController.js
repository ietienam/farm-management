'use strict';

var AppError = require('../utils/appError');

//HANDLE ERRORS FROM INVALID FIELDS
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleWebTokenError = () => new AppError('Invalid Token! Please login again', 401);

const handleExpiredTokenError = () => new AppError('Token Expired! Please login again', 401);


//GLOBAL ERROR HANDLER
const sendError = (err, res) => {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //LOG TO CONSOLE
    //console.error("ERROR: ", err);

    // B) Programming or other unknown error: don't leak error details
    res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

module.exports = (err, req, res, next) => {
  // default error status and statuscode
  err.statusCode = err.statusCode || 500;
  err.status = err.status || false;

  let error = { ...err, message: err.message };
  //console.log(error);

  //INVALID ENTRY ERROR(HANDLES VALIDATION ERROR FOR FIELDS)
  if (error.errors) error = handleValidationErrorDB(error);
  //HANDLE DUPLICATE EMAIL
  if (error.name === 'JsonWebTokenError') error = handleWebTokenError();
  if (error.name === 'TokenExpiredError') error = handleExpiredTokenError();

  sendError(error, res);
};
