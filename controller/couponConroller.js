"use strict";

var { v4: uuidv4 } = require("uuid");

var Coupon = require("../model/coupon");
var AppError = require("../utils/appError");
var catchAsync = require("../utils/catchAsync");
var APIFeatures = require("../utils/apiFeatures");

exports.all_active_coupons = catchAsync(async (req, res, next) => {
  let features = new APIFeatures(
    Coupon.find({ coupon_status: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let coupons = await features.query;
  res.status(200).json({
    status: true,
    data: {
      coupons,
    },
  });
});

exports.all_inactive_coupons = catchAsync(async (req, res, next) => {
  let features = new APIFeatures(
    Coupon.find({ coupon_status: false }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let coupons = await features.query;
  res.status(200).json({
    status: true,
    data: {
      coupons,
    },
  });
});

exports.create_coupon = catchAsync(async (req, res, next) => {
  let coupon_value = uuidv4();
  coupon_value = coupon_value.substring(0, 6);

  let new_coupon = await Coupon.create({
    value: req.body.value,
    coupon: coupon_value,
    coupon_status: true,
    expires_at: req.body.date, // format = MM/DD/YYYY
  });

  if (new_coupon) {
    res.status(201).json({
      status: true,
      data: {
        coupon: new_coupon,
      },
    });
  } else {
    return next(new AppError("Failed to create coupon. Try again!", 400));
  }
});

exports.deactivate_coupon = catchAsync(async (req, res, next) => {
  let coupon = await Coupon.findByIdAndUpdate(
    { _id: req.params.id },
    { coupon_status: false },
    { new: true }
  );

  if (coupon) {
    res.status(200).json({
      status: true,
      data: {
        coupon,
      },
    });
  } else {
    return next(new AppError("Failed to deactivate coupon", 400));
  }
});

exports.deactivate_expired_coupon = async () => {
  let date = new Date().toLocaleString().split(",")[0];
  let expired_coupons = await Coupon.find({
    expires_at: date,
    coupon_status: true,
  });
  if (expired_coupons) {
    expired_coupons.map(async (coupon) => {
      await Coupon.findByIdAndUpdate(
        { _id: coupon._id },
        { coupon_status: false },
        { new: true }
      );
    });
  }
};

exports.modify_coupon_value = catchAsync(async (req, res, next) => {
  let coupon = await Coupon.findByIdAndUpdate(
    { _id: req.params.id },
    { value: req.body.value },
    { new: true }
  );

  if (coupon) {
    res.status(200).json({
      status: true,
      data: {
        coupon,
      },
    });
  } else {
    return next(new AppError("Failed to modify coupon value", 400));
  }
});

exports.use_coupon = catchAsync(async (req, res, next) => {
  // check if coupon is valid
  // check if it has been used by a user before
  let coupon = req.body.coupon;
  let check_coupon = await Coupon.find({
    coupon: coupon,
    coupon_status: true,
  }).select(["-used_at", "__v"]);
  if (check_coupon) {
    let date = new Date().toLocaleString().split(",")[0];
    await Coupon.findByIdAndUpdate(
      { _id: check_coupon._id },
      { coupon_status: false, used_at: date },
      { new: true }
    );
    res.status(200).json({
      status: true,
      data: {
        coupon: check_coupon,
      },
    });
  }
});
