let Order = require('../model/orders');
let Transfer = require('../model/tranfers');

let catchAsync = require('../utils/catchAsync');
let AppError = require('../utils/appError');
let APIFeatures = require('../utils/apiFeatures');

module.exports = {
  total_crop_orders,
  total_crop_deliveries,
  total_crops_in_transit,
  total_failed_deliveries
}