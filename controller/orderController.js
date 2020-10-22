let Order = require("../model/orders");
let { v4: uuidv4 } = require("uuid");

let AppError = require("../utils/appError");
let catchAsync = require("../utils/catchAsync");
let APIFeatures = require("../utils/apiFeatures");

module.exports = {
  all_active_orders: catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Order.find({ order_status: 0 }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let orders = await features.query;
    res.status(200).json({
      status: true,
      results: orders.length,
      data: {
        orders,
      },
    });
  }),

  all_orders_in_transit: catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Order.find({ order_status: 1 }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let transit = await features.query;
    res.status(200).json({
      status: true,
      results: transit.length,
      data: {
        transit,
      },
    });
  }),

  all_orders_delivered: catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Order.find({ order_status: 2 }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let delivered = await features.query;
    res.status(200).json({
      status: true,
      results: delivered.length,
      data: {
        delivered,
      },
    });
  }),

  all_orders_failed: catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Order.find({ order_status: 3 }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let delivered = await features.query;
    res.status(200).json({
      status: true,
      results: delivered.length,
      data: {
        delivered,
      },
    });
  }),

  create_order: catchAsync(async (req, res, next) => {
    let order_id = `Smorfarms-crops-order-${uuidv4()}`;
    let request_obj = { ...req.body, order_id };
    //console.log(request_obj);
    const order = await Order.create(request_obj);

    res.status(201).json({
      status: true,
      data: {
        order,
      },
    });
  }),

  confirm_transit: catchAsync(async (req, res, next) => {
    let order = await Order.findOneAndUpdate(
      { order_id: req.params.order_id },
      { order_status: 1 },
      { new: true }
    );

    res.status(200).json({
      status: true,
      data: {
        order,
      },
    });
  }),

  confirm_delivery: catchAsync(async (req, res, next) => {
    let order = await Order.findOneAndUpdate(
      { order_id: req.params.order_id },
      { order_status: 2 },
      { new: true }
    );

    res.status(200).json({
      status: true,
      data: {
        order,
      },
    });
  }),

  confirm_failure: catchAsync(async (req, res, next) => {
    let order = await Order.findOneAndUpdate(
      { order_id: req.params.order_id },
      { order_status: 3 },
      { new: true }
    );

    res.status(200).json({
      status: true,
      data: {
        order,
      },
    });
  }),
};
