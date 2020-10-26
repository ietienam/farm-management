"use strict";

var express = require("express");
var router = express.Router();

var transferController = require("../controller/transferController");
var auth = require('../controller/authController');

router.use(auth.protect);

router.route("/create/:order_id").post(transferController.create_transfer);
router.route("/transit/:transfer_id").patch(transferController.confirm_transit);
router
  .route("/deliver/:transfer_id")
  .patch(transferController.confirm_delivery);
router.route("/fail/:transfer_id").patch(transferController.confirm_failure);
router.route("/cancel/:transfer_id").patch(transferController.cancel_transfer);
router.route("/request").get(transferController.all_active_transfer_requests);
router.route("/transit").get(transferController.all_transfers_in_transit);
router.route("/deliver").get(transferController.all_transfers_delivered);
router.route("/fail").get(transferController.all_transfers_failed);
router.route("/cancel").get(transferController.all_cancelled_transfers);
router.route("/transfers").get(transferController.all_transfers);

module.exports = router;
