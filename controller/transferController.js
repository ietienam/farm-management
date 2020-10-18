let Transfer = require("../model/tranfers");
let Order = require("../model/orders");
let { v4: uuidv4 } = require("uuid");

let AppError = require("../utils/appError");
let catchAsync = require("../utils/catchAsync");
let APIFeatures = require("../utils/apiFeatures");

module.exports = {
  create_transfer: catchAsync(async (req, res, next) => {
    // check that the order was delivered before you request transfer
    let order_id = req.params.order_id;
    let delivered_order = await Order.find({ order_id });
    if (delivered_order.is_delivered !== true) {
      return next(
        new AppError(
          "You can only transfer crops from Benue that have first been delivered",
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

  confirm_delivery: catchAsync(async (req, res, next) => {
    let transfer = await Transfer.findOneAndUpdate(
      { transfer_id: req.params.transfer_id },
      { is_delivered: true },
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
