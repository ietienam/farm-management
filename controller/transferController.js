"use strict";

var Transfer = require("../model/tranfers");
var Order = require("../model/orders");
var { v4: uuidv4 } = require("uuid");

var AppError = require("../utils/appError");
var catchAsync = require("../utils/catchAsync");
var APIFeatures = require("../utils/apiFeatures");

module.exports = {
  all_transfers: catchAsync(async (req, res, next) => {
    let { destination, from } = req.query;
    let features = new APIFeatures(
      Transfer.find({ destination, from }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let transfers = await features.query;
    res.status(200).json({
      status: true,
      data: {
        transfers,
      },
    });
  }), // filter by destination and from

  all_active_transfer_requests: catchAsync(async (req, res, next) => {
    let features = new APIFeatures(
      Transfer.find({ transfer_status: 0 }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let transfer_requests = await features.query;
    res.status(200).json({
      status: true,
      results: transfer_requests.length,
      data: {
        transfer_requests,
      },
    });
  }),

  all_transfers_in_transit: catchAsync(async (req, res, next) => {
    let features = new APIFeatures(
      Transfer.find({ transfer_status: 1 }),
      req.query
    )
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

  all_transfers_failed: catchAsync(async (req, res, next) => {
    let features = new APIFeatures(
      Transfer.find({ transfer_status: 3 }),
      req.query
    )
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

  all_transfers_delivered: catchAsync(async (req, res, next) => {
    let features = new APIFeatures(
      Transfer.find({ transfer_status: 2 }),
      req.query
    )
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

  all_cancelled_transfers: catchAsync(async (req, res, next) => {
    let features = new APIFeatures(
      Order.find({ transfer_status: 4 }),
      req.query
    )
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

  create_transfer: catchAsync(async (req, res, next) => {
    // check that the order was delivered before you request transfer
    let order_id = req.params.order_id;
    let delivered_order = await Order.find({ order_id });
    if (delivered_order.order_status !== 2) {
      return next(
        new AppError(
          "You can only transfer crops that have first been delivered",
          400
        )
      );
    } else {
      let transfer_id = `Smorfarms-crops-transfer-${uuidv4()}`;
      let request_obj = { ...req.body, transfer_id, order_id };
      //console.log(request_obj);
      const transfer = await Transfer.create(request_obj);

      res.status(201).json({
        status: true,
        data: {
          transfer,
        },
      });
    }
  }),

  confirm_transit: catchAsync(async (req, res, next) => {
    let transfer = await Transfer.findOneAndUpdate(
      { transfer_id: req.params.transfer_id },
      { transfer_status: 1 },
      { new: true }
    );

    res.status(200).json({
      status: true,
      data: {
        transfer,
      },
    });
  }),

  confirm_delivery: catchAsync(async (req, res, next) => {
    let transfer = await Transfer.findOneAndUpdate(
      { transfer_id: req.params.transfer_id },
      { transfer_status: 2 },
      { new: true }
    );

    res.status(200).json({
      status: true,
      data: {
        transfer,
      },
    });
  }),

  confirm_failure: catchAsync(async (req, res, next) => {
    let transfer = await Transfer.findOneAndUpdate(
      { transfer_id: req.params.transfer_id },
      { transfer_status: 3 },
      { new: true }
    );

    res.status(200).json({
      status: true,
      data: {
        transfer,
      },
    });
  }),

  cancel_transfer: catchAsync(async (req, res, next) => {
    let transfer_id = req.params.order_id;
    let transfer = await Order.find({ order_id });
    if (transfer.transfer_status === 0) {
      let transfer_request = await Order.findOneAndUpdate(
        { transfer_id },
        { transfer_status: 4 },
        { new: true }
      );
      res.status(200).json({
        status: true,
        data: {
          transfer_request,
        },
      });
    } else {
      return next(new AppError("You can not cancel this transfer", 400));
    }
  }),
};
