let Order = require("../model/orders");
let { v4: uuidv4 } = require("uuid");

let AppError = require("../utils/appError");
let catchAsync = require("../utils/catchAsync");
let APIFeatures = require("../utils/apiFeatures");

module.exports = {
  create_order: catchAsync(async (req, res, next) => {
    let order_id = `Smorfarms-crops-${uuidv4()}`;
    let request_obj = { ...req.body, order_id };
    console.log(request_obj);
    const order = await Order.create(request_obj);

    res.status(201).json({
      status: true,
      data: {
        order,
      },
    });
  }),

  confirm_delivery: catchAsync(async (req, res, next) => {
    let order = await Order.findOneAndUpdate(
      { order_id: req.params.order_id },
      { is_delivered: true },
      { new: true }
    );

    res.status(200).json({
      status: true,
      data: {
        order
      }
    })
  }),
};
