"use strict";

var express = require("express");
var router = express.Router();
var couponController = require("../controller/couponConroller");
var auth = require("../controller/authController");

router.use(auth.protect);

router.route("/active").get(couponController.all_active_coupons);
router.route("/inactive").get(couponController.all_inactive_coupons);
router.route("/deactivate/:id").patch(couponController.deactivate_coupon);
router.route("/modify/:id").patch(couponController.modify_coupon_value);
router.route("/use").patch(couponController.use_coupon);
router.route("/create").post(couponController.create_coupon);

module.exports = router;
