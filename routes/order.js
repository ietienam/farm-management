"use strict";

var express = require("express");
var router = express.Router();

var orderController = require("../controller/orderController");
var auth = require('../controller/authController');

router.use(auth.protect);

router.route("/create").post(orderController.create_order);
router.route("/transit/:order_id").patch(orderController.confirm_transit);
router.route("/deliver/:order_id").patch(orderController.confirm_delivery);
router.route("/fail/:order_id").patch(orderController.confirm_failure);
router.route("/cancel/:order_id").patch(orderController.cancel_order);
router.route("/request").get(orderController.all_active_orders);
router.route("/transit").get(orderController.all_orders_in_transit);
router.route("/deliver").get(orderController.all_orders_delivered);
router.route("/fail").get(orderController.all_orders_failed);
router.route("/cancel").get(orderController.all_cancelled_orders);
router.route("/orders").get(orderController.all_orders);

module.exports = router;
