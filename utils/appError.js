class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = false;
    this.isOperational = true;
  }
}

module.exports = AppError;
