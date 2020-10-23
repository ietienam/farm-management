'use strict';

var express = require('express');
var rateLimit = require('express-rate-limit');
var helmet = require('helmet');
var mongoSanitize = require('express-mongo-sanitize');
var xss = require('xss-clean');
var cors = require('cors');

var AppError = require('./utils/appError');
var globalErrorHandler = require('./controller/errController');
var order_routes = require('./routes/order');
var transfer_routes = require('./routes/transfer');
var upload_routes = require('./routes/upload');

//VARIABLES
var app = express();

app.enable('trust proxy');

app.use(cors());

//GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
var limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString();
  console.log(req.requestTime);
  next();
});

//ROUTES
app.use('/api/v1/orders', order_routes);
app.use('/api/v1/transfers', transfer_routes);
app.use('/api/v1/images', upload_routes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
