'use strict';

var Order = require("../model/orders");
var { v4: uuidv4 } = require("uuid");

var AppError = require("../utils/appError");
var catchAsync = require("../utils/catchAsync");
var APIFeatures = require("../utils/apiFeatures");

module.exports = {
  all_orders: catchAsync(async (req, res, next) => {
    let { destination, from } = req.query;
    let orders = await Order.find({ destination, from });
    res.status(200).json({
      status: true,
      data: {
        orders
      }
    })
  }), // filter by destination and from

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

  all_cancelled_orders: catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Order.find({ order_status: 4 }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let cancelled = await features.query;
    res.status(200).json({
      status: true,
      results: cancelled.length,
      data: {
        cancelled,
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

  cancel_order: catchAsync(async (req, res, next) => {
    let order_id = req.params.order_id;
    let order = await Order.find({ order_id });
    if (order.order_status === 0) {
      let cancelled_order = await Order.findOneAndUpdate(
        { order_id },
        { order_status: 4 },
        { new: true }
      );
      res.status(200).json({
        status: true,
        data: {
          cancelled_order,
        },
      });
    } else {
      return next(new AppError("You can not cancel this order", 400));
    }
  }),
};
