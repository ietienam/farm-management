let express = require('express');
let rateLimit = require('express-rate-limit');
let helmet = require('helmet');
let mongoSanitize = require('express-mongo-sanitize');
let xss = require('xss-clean');
let cors = require('cors');

let AppError = require('./utils/appError');
let globalErrorHandler = require('./controller/errController');
let order_routes = require('./routes/order');
let transfer_routes = require('./routes/transfer');

//VARIABLES
let app = express();

app.enable('trust proxy');

app.use(cors());

//GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
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

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
