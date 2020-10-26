"use strict";

var express = require("express");
var router = express.Router();

var uploadController = require("../controller/uploadController");
var auth = require('../controller/authController');

router.use(auth.protect);

router
  .route("/upload")
  .post(
    uploadController.upload_photo,
    uploadController.resize_photo,
    uploadController.upload_to_DB
  );
router.route("/delete").delete(uploadController.delete_from_DB);

module.exports = router;
