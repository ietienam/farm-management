let Transfer = require("../model/tranfers");
let Order = require("../model/orders");
let { v4: uuidv4 } = require("uuid");

let AppError = require("../utils/appError");
let catchAsync = require("../utils/catchAsync");
let APIFeatures = require("../utils/apiFeatures");

module.exports = {
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
};
